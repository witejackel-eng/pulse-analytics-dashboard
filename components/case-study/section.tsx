export function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-border-subtle py-10 first:pt-0 last:border-0">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="mono-nums text-[12px] text-text-disabled">{number}</span>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 text-[14px] leading-relaxed text-text-secondary [&_h3]:mt-2 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:text-text-primary [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-text-primary">
        {children}
      </div>
    </section>
  );
}
