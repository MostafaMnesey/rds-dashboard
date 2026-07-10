import { Drawer, Popconfirm } from "antd";
import { format } from "date-fns";
import {
  Calendar,
  Mail as MailIcon,
  MessageSquare,
  Phone,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { memo } from "react";
import Button from "../../../components/ui/Button";
import { getMailTypeMeta } from "../utils";

const TYPE_BADGE_COLORS = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  gray: "bg-gray-50 text-gray-700 border-gray-200",
};

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.03]">
      <Icon size={14} className="text-secondary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
        {label}
      </p>
      <div className="mt-0.5 text-sm text-soft-black">{children}</div>
    </div>
  </div>
);

const MailDetailsDrawer = ({ open, onClose, mail, onDelete, isDeleting }) => {
  if (!mail) return null;

  const typeMeta = getMailTypeMeta(mail.type);
  const badgeColor =
    TYPE_BADGE_COLORS[typeMeta.color] || TYPE_BADGE_COLORS.gray;

  const formattedDate = mail.createdAt
    ? format(new Date(mail.createdAt), "MMM dd, yyyy 'at' hh:mm a")
    : "—";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={540}
      destroyOnClose
      closable={false}
      title={null}
      styles={{
        body: { padding: 0, background: "#fafaf9" },
        header: { display: "none" },
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 bg-white px-6 py-5">
          <div className="min-w-0">
            <h2 className="font-oswald text-xl font-bold uppercase tracking-wide text-soft-black">
              Message Details
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Submitted on {formattedDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 text-secondary transition hover:border-black/20 hover:text-soft-black"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Sender Information
            </h3>

            <div className="divide-y divide-black/5">
              <DetailRow icon={User} label="Name">
                {mail.name}
              </DetailRow>

              <DetailRow icon={MailIcon} label="Email">
                <a
                  href={`mailto:${mail.email}`}
                  className="text-main underline-offset-2 hover:underline"
                >
                  {mail.email}
                </a>
              </DetailRow>

              <DetailRow icon={Phone} label="Phone">
                {mail.phone ? (
                  <a
                    href={`tel:${mail.phone}`}
                    className="text-main underline-offset-2 hover:underline"
                  >
                    {mail.phone}
                  </a>
                ) : (
                  <span className="text-secondary">—</span>
                )}
              </DetailRow>

              <DetailRow icon={Tag} label="Type">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeColor}`}
                >
                  {typeMeta.label}
                </span>
              </DetailRow>

              <DetailRow icon={Calendar} label="Date">
                {formattedDate}
              </DetailRow>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Subject
            </h3>
            <p className="text-sm font-medium text-soft-black">
              {mail.subject || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare size={14} className="text-secondary" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                Message
              </h3>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-soft-black">
              {mail.message || "—"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-black/5 bg-white px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <Popconfirm
            title="Delete message"
            description={
              <span className="text-xs text-secondary">
                This action cannot be undone.
              </span>
            }
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
            placement="topRight"
            onConfirm={() => onDelete(mail.id)}
          >
            <button
              type="button"
              disabled={isDeleting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} />
              {isDeleting ? "Deleting..." : "Delete Message"}
            </button>
          </Popconfirm>
        </div>
      </div>
    </Drawer>
  );
};

export default memo(MailDetailsDrawer);
