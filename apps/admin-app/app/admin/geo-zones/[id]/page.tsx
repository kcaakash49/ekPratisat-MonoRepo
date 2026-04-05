import ZoneDetail from "../../../../components/ZoneDetail";


export default async function ZoneDetailPage({ params }: { params: { id: string } }) {
    const param = await params;
    const id = param.id;

    return <ZoneDetail id={id} />
}