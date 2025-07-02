"use client";

import {
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const defaultConfig = {
  // Momentum settings - adjust for speed/feel
  velocityMultiplier: 12, // Lower = slower momentum, Higher = faster momentum
  deceleration: 0.92, // Lower = quicker stops, Higher = longer coasting
  minVelocity: 0.1, // Lower = more sensitive to small movements

  // Elastic boundary settings - adjust for bounce feel
  elasticResistance: 0.5, // Lower = more resistance, Higher = less resistance
  springForce: 0.15, // Lower = softer spring, Higher = snappier spring
  elasticDamping: 0.8, // Lower = more damping, Higher = less damping

  // Visual feedback settings - adjust for boundary indicators
  boundaryThreshold: 10, // Lower = earlier activation, Higher = later activation
  maxBoundaryOffset: 410, // Lower = subtle movement, Higher = obvious movement
  boundaryMultiplier: 1, // Lower = less responsive, Higher = more responsive
  boundaryTransition: "transform 0.4s ease", // CSS transition timing

  // Smoothing settings - adjust for responsiveness vs smoothness
  velocityHistorySize: 10, // Higher = smoother but less responsive
  velocitySmoothingCount: 5, // Higher = smoother momentum start
};

export default function HorizontalScrollContainer({
  children,
  config = defaultConfig,
}: {
  children: ReactNode;
  config?: Partial<typeof defaultConfig>;
}) {
  // Merge user config with defaults
  const scrollConfig = { ...defaultConfig, ...config };

  // DOM references
  const containerRef = useRef<HTMLDivElement | null>(null); // Main scrollable container
  const childrenRef = useRef<HTMLDivElement | null>(null); // Inner wrapper for children

  // Drag state management
  const [isDragging, setIsDragging] = useState(false); // Is user currently dragging?
  const [startX, setStartX] = useState(0); // Initial mouse X position
  const [scrollLeft, setScrollLeft] = useState(0); // Initial scroll position
  const [boundaryOffset, setBoundaryOffset] = useState(0); // Visual boundary feedback offset

  // Momentum scrolling state
  const velocityRef = useRef(0); // Current velocity for momentum
  const lastXRef = useRef(0); // Last mouse X position
  const lastTimeRef = useRef(0); // Last timestamp for velocity calc
  const animationFrameRef = useRef<number | null>(null); // RequestAnimationFrame ID

  // Velocity smoothing - keeps recent velocity history for smoother momentum
  const velocityHistoryRef = useRef<number[]>([]);

  // Elastic boundary state - tracks when we're in bounce-back mode
  const isElasticRef = useRef(false);

  /**
   * Calculates smooth velocity from recent mouse movements
   * This prevents jerky momentum starts by averaging recent velocity samples
   */
  const getSmoothVelocity = () => {
    if (velocityHistoryRef.current.length === 0) return 0;

    // Take average of recent velocities for smoother momentum
    const recentCount = Math.min(
      scrollConfig.velocitySmoothingCount,
      velocityHistoryRef.current.length,
    );
    const recentVelocities = velocityHistoryRef.current.slice(-recentCount);
    return recentVelocities.reduce((sum, v) => sum + v, 0) / recentCount;
  };

  /**
   * Updates the visual boundary feedback effect
   * Translates the content slightly to indicate start/end boundaries
   */
  const updateBoundaryFeedback = useCallback(
    (scrollPosition: number) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      let offset = 0;
      if (scrollPosition < -scrollConfig.boundaryThreshold) {
        // At start boundary - translate right to indicate "beginning"
        offset = Math.min(
          scrollConfig.maxBoundaryOffset,
          Math.abs(scrollPosition) * scrollConfig.boundaryMultiplier,
        );
      } else if (scrollPosition > maxScroll + scrollConfig.boundaryThreshold) {
        // At end boundary - translate left to indicate "end"
        offset = -Math.min(
          scrollConfig.maxBoundaryOffset,
          (scrollPosition - maxScroll) * scrollConfig.boundaryMultiplier,
        );
      }

      setBoundaryOffset(offset);
    },
    [
      scrollConfig.boundaryThreshold,
      scrollConfig.maxBoundaryOffset,
      scrollConfig.boundaryMultiplier,
    ],
  );

  /**
   * Main animation loop for momentum scrolling and elastic boundaries
   * Runs at 60fps using requestAnimationFrame for smooth performance
   */
  const animateMomentum = useCallback(() => {
    if (!containerRef.current) {
      animationFrameRef.current = null;
      return;
    }

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    // Check if we're beyond valid scroll boundaries
    const isOutOfBounds = currentScroll < 0 || currentScroll > maxScroll;

    if (isOutOfBounds || isElasticRef.current) {
      // ELASTIC BOUNCE MODE: Spring back to valid boundaries
      isElasticRef.current = true;

      // Determine target position (valid boundary)
      let targetScroll;
      if (currentScroll < 0) {
        targetScroll = 0; // Spring back to start
      } else if (currentScroll > maxScroll) {
        targetScroll = maxScroll; // Spring back to end
      } else {
        targetScroll = currentScroll; // We're back in bounds
        isElasticRef.current = false;
      }

      // Apply spring physics - distance determines force
      const distance = targetScroll - currentScroll;
      const springForce = distance * scrollConfig.springForce;

      // Close enough? Snap to final position and stop
      if (Math.abs(distance) < 0.5) {
        container.scrollLeft = targetScroll;
        velocityRef.current = 0;
        isElasticRef.current = false;
        setBoundaryOffset(0); // Reset visual feedback
        animationFrameRef.current = null;
        return;
      }

      // Apply spring force and update visual feedback
      container.scrollLeft += springForce;
      updateBoundaryFeedback(container.scrollLeft);
      velocityRef.current *= scrollConfig.elasticDamping; // Reduce velocity during bounce
    } else {
      // NORMAL MOMENTUM MODE: Apply velocity and deceleration
      if (Math.abs(velocityRef.current) < scrollConfig.minVelocity) {
        setBoundaryOffset(0); // Reset visual feedback
        animationFrameRef.current = null;
        return;
      }

      // Apply momentum velocity to scroll position
      container.scrollLeft -= velocityRef.current;
      updateBoundaryFeedback(container.scrollLeft);

      // Apply physics deceleration (friction)
      velocityRef.current *= scrollConfig.deceleration;
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [
    updateBoundaryFeedback,
    scrollConfig.springForce,
    scrollConfig.elasticDamping,
    scrollConfig.minVelocity,
    scrollConfig.deceleration,
  ]);

  /**
   * Handles mouse press - starts drag operation
   */
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current) return;

    // Stop any ongoing momentum animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Initialize drag state
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);

    // Reset velocity tracking
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    velocityHistoryRef.current = [];
    isElasticRef.current = false;

    // Prevent text selection during drag
    e.preventDefault();
  };

  /**
   * Handles mouse movement during drag
   * Provides immediate scroll response and tracks velocity for momentum
   */
  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Calculate how far the mouse has moved
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    const newScrollLeft = scrollLeft - walk;

    // Apply elastic resistance at boundaries for better UX
    let actualScroll = newScrollLeft;

    if (newScrollLeft < 0) {
      // Elastic resistance at start - reduce movement for feedback
      actualScroll = newScrollLeft * scrollConfig.elasticResistance;
    } else if (newScrollLeft > maxScroll) {
      // Elastic resistance at end - reduce movement for feedback
      const overshoot = newScrollLeft - maxScroll;
      actualScroll = maxScroll + overshoot * scrollConfig.elasticResistance;
    }

    // Apply scroll and update visual feedback immediately
    container.scrollLeft = actualScroll;
    updateBoundaryFeedback(actualScroll);

    // Track velocity for momentum calculation
    const currentTime = performance.now();
    const timeDelta = currentTime - lastTimeRef.current;

    if (timeDelta > 0) {
      const positionDelta = e.pageX - lastXRef.current;
      const currentVelocity =
        (positionDelta / timeDelta) * scrollConfig.velocityMultiplier;

      // Store in history for velocity smoothing
      velocityHistoryRef.current.push(currentVelocity);
      if (
        velocityHistoryRef.current.length > scrollConfig.velocityHistorySize
      ) {
        velocityHistoryRef.current.shift(); // Remove old samples
      }
    }

    // Update tracking variables
    lastXRef.current = e.pageX;
    lastTimeRef.current = currentTime;
  };

  /**
   * Handles mouse release - starts momentum scrolling if velocity exists
   */
  const handleMouseUp = () => {
    setIsDragging(false);

    // Calculate final velocity from recent movement history
    velocityRef.current = getSmoothVelocity();

    // Start momentum animation if there's enough velocity or we need to bounce back
    if (
      Math.abs(velocityRef.current) > scrollConfig.minVelocity ||
      isElasticRef.current
    ) {
      animationFrameRef.current = requestAnimationFrame(animateMomentum);
    } else {
      setBoundaryOffset(0); // Reset visual feedback if no momentum
    }
  };

  /**
   * Handles mouse leaving container - stops momentum immediately
   * Better UX for mouse interaction vs touch (where momentum should continue)
   */
  const handleMouseLeave = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Stop momentum immediately for better mouse UX
    velocityRef.current = 0;

    // Still need to animate back if we're out of bounds
    if (!containerRef.current) return;

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    const isOutOfBounds = currentScroll < 0 || currentScroll > maxScroll;

    if (isOutOfBounds) {
      isElasticRef.current = true;
      animationFrameRef.current = requestAnimationFrame(animateMomentum);
    } else {
      setBoundaryOffset(0); // Reset visual feedback
    }
  };

  // Reset boundary offset when idle (no dragging, no animation)
  useEffect(() => {
    if (!isDragging && !animationFrameRef.current) {
      setBoundaryOffset(0);
    }
  }, [isDragging]);

  return (
    <div
      className={`no-visible-scrollbar my-10 flex gap-10 overflow-x-auto select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        // Disable browser smooth scrolling for immediate response
        scrollBehavior: "auto",
      }}
    >
      {/* Inner wrapper with translate3d for boundary feedback */}
      <div
        ref={childrenRef}
        style={{
          display: "flex",
          gap: "2.5rem",
          // Hardware-accelerated translation for boundary feedback
          transform: `translate3d(${boundaryOffset}px, 0, 0)`,
          // Smooth transition when not actively dragging
          transition: isDragging ? "none" : scrollConfig.boundaryTransition,
        }}
      >
        {children}
      </div>
    </div>
  );
}
