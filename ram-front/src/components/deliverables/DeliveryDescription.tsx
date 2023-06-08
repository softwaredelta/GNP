// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2139953787
// * M1_S012

interface DeliveryDescriptionProps {
  description: string;
}

export default function DeliveryDescription({
  description,
}: DeliveryDescriptionProps): JSX.Element {
  return (
    <div role="description">
      <h1 className="pt-8 text-2xl font-semibold text-gnp-orange-500">
        Descripción
      </h1>
      <text className="px-12 text-lg">{description}</text>
    </div>
  );
}
