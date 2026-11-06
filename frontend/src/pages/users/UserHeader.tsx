import { Hand } from "lucide-react"

const UserHeader = () => {
  return (
      <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Good afternoon,</p>

        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
        Benedict
        <Hand className="h-5 w-5 text-amber-500" />
        </h1>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-600">
        B
      </div>
    </div>
  )
}

export default UserHeader