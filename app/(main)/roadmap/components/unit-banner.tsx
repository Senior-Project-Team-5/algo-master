
type Props = {
    title: string;
}

export const UnitBanner = ({ title }: Props) => {
    return (
        <div className="w-full rounded-xl bg-green-500 p-5 text-white flex items-center justify-between">
            <div className="space-y-2.5">
                <h3 className="text-2xl font-bold">
                    {title}
                </h3>
            </div>
        </div>
    )
}