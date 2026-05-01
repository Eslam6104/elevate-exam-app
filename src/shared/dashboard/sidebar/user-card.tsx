export default function UserCard() {

  return (

    <div className="p-4 border-t border-slate-700">

      <div className="flex items-center gap-3">

        <img
          src="/avatar.png"
          className="w-10 h-10 rounded-full"
        />

        <div>

          <p className="text-sm font-medium">
            Firstname
          </p>

          <p className="text-xs text-gray-400">
            user@email.com
          </p>

        </div>

      </div>

    </div>
  );
}