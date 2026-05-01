type Props = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export default function FeatureItem({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex gap-4">

      <div className="text-(--primary)">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="font-semibold text-(--primary)">
          {title}
        </h3>

        <p className="text-sm text-(--text-secondary)">
          {description}
        </p>
      </div>

    </div>
  );
}