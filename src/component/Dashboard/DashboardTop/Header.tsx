
function Header() {
    return (
        <section>
            <div className="flex justify-between my-4">
                <div className="left h-4">
                    <h1 className="text-3xl font-bold">Welcome back , Islam Salah</h1>
                    <p className="text-gray-600 text-sm">Welcome to your dashboard</p>
                </div>
                <div className="right flex gap-2">
                    <button className="border-gray-400 border-solid border-1 fa-regular fa-bell !flex text-black text-lg px-5 py-3 justify-center rounded-full hover:bg-blue-700 hover:text-white transition"></button>
                    <div className="  flex text-center align-middle border-1 border-gray-400 rounded-3xl py-2 px-4 border-solid">
                        <p className="m-auto">this month</p>
                    </div>
                    <div className=" flex border-1 border-gray-400 rounded-3xl pe-10 border-solid">
                        <img className="w-7 h-7 rounded-full m-2" src="https://avatars.githubusercontent.com/u/9919?s=280&v=4" alt="profile" />
                        <div className="align-middle">
                            <h3>Islam Salah</h3>
                            <p className="text-sm text-gray-400 mt-[-.4rem]">islam.salah.is08@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Header