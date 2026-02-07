function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        h-10 w-10
        rounded-full
        bg-brand-surface
        border border-brand-line
        grid place-items-center
        text-brand-ink
        transition
        hover:bg-brand-muted
        hover:scale-[1.05]
      "
    >
      {children}
    </a>
  );
}
export default SocialIcon;

