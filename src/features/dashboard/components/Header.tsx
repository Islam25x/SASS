
import { Bell } from "lucide-react";
import { Button, Text } from "../../../shared/ui";

function Header() {
    return (
        <section>
            <div className="flex justify-between my-4 mx-4">
                <div className="left h-4">
                    <Text as="h1" variant="title" weight="bold" className="text-3xl">
                        Welcome back , Islam Salah
                    </Text>
                    <Text variant="body" className="text-gray-600 text-sm">
                        Welcome to your dashboard
                    </Text>
                </div>
                <div className="right flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        shape="circle"
                        className="border-gray-400 border-solid border-1 text-black h-11 w-11 p-0 hover:bg-primary-700 hover:text-white"
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                    </Button>
                    <div className="  flex text-center align-middle border-1 border-gray-400 rounded-3xl py-2 px-4 border-solid">
                        <Text variant="body" className="m-auto">
                            this month
                        </Text>
                    </div>
                    <div className=" flex border-1 border-gray-400 rounded-3xl pe-10 border-solid">
                        <img className="w-7 h-7 rounded-full object-cover m-2" src="https://avatars.githubusercontent.com/u/9919?s=280&v=4" alt="profile" />
                        <div className="align-middle">
                            <Text as="h3" variant="body" weight="medium">
                                Islam Salah
                            </Text>
                            <Text variant="caption" className="text-sm text-gray-400 mt-[-.4rem]">
                                islam.salah.is08@gmail.com
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Header
