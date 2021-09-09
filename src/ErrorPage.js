export default function ErrorPage()
{
    return <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
        <img src="/error404.png" width={347} alt=""/>
        <div className="text-7xl mt-16 font-black text-gray-400">Whoops</div>
        <div className="text-2xl mt-6">Ce message a expiré ou n'existe plus</div>
    </div>
}
