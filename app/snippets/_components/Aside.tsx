import SidebarButtons from "@/app/snippets/_components/SidebarButtons";
import { routes } from "@/constants/constants";

export default function Aside() {
  return (
    <>
      <aside className="hidden w-full pt-6 lg:block ltr:border-r rtl:border-l">
        <nav className="grid gap-7 px-5">
          {routes.snippets.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 font-semibold tracking-tight">
                {section.title}
              </h4>
              <div className="space-y-1">
                <SidebarButtons items={section.items} />
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
