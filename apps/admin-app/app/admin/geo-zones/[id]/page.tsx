import ZoneDetail from "../../../../components/ZoneDetail";

type Props = {
  params: Promise<{ id: string }>
}

export default async function ZoneDetailPage({ params }: Props) {
    const param = await params;
    const id = param.id;

    return <ZoneDetail id={id} />
}