"use client";

type Props = {
  visible: boolean;
};

export default function EmptyState({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="empty-state" id="emptyState">
      <div className="empty-icon">📱</div>
      <p>
        Enter two phone names in the selector, then tap <strong>Compare</strong>{" "}
        to see scores and a winner from the API.
      </p>
    </div>
  );
}
