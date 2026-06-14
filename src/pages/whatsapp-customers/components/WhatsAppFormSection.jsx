import { memo } from "react";

const WhatsAppFormSection = ({
    icon: Icon,
    title,
    description,
    badge,
    children,
}) => {
    return (
        <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-rds-sm">
            <header className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    {Icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                            <Icon size={18} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-soft-black">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-0.5 text-xs text-secondary">{description}</p>
                        )}
                    </div>
                </div>
                {badge && <div className="shrink-0">{badge}</div>}
            </header>

            <div className="space-y-4">{children}</div>
        </section>
    );
};

export default memo(WhatsAppFormSection);