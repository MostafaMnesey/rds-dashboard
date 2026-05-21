import { Star } from "lucide-react";

const BlogFeaturedTag = ({ featured }) => {
  if (featured) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Star size={11} className="fill-amber-500 stroke-amber-500" />
        Featured
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-secondary">
      Standard
    </span>
  );
};

export default BlogFeaturedTag;
