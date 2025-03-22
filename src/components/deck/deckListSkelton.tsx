import { CnSkeleton } from "../ui/skeleton";

export default function DeckListSkelton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg overflow-hidden">
                    <CnSkeleton className="w-full h-[200px]" />
                    <div className="p-2">
                        <CnSkeleton className="h-6 w-3/4 mb-2" />
                        <CnSkeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}