import { Center, Divider, Avatar } from "@chakra-ui/react";
import { Input } from "antd";
import { Bell, Search } from "lucide-react";
import { getCurrentDate, getGreeting } from "../../lib/utils"
import { useAuth } from "../../hooks/useAuth";
export const Header = () => {
    const { user } = useAuth()
    return (
        <div className="flex items-center justify-between gap-8 mb-8">
            <Input
                style={{ width: "30vw" }}
                variant="filled"
                size="large"
                placeholder="Search for Anything"
                prefix={<Search />}
            />
            <p>{getCurrentDate()}</p>
            <Center height='50px'>
                <Divider orientation='vertical' />
            </Center>
            <Bell fill="gray" color='gray' size={30} />
            <Center height='50px'>
                <Divider orientation='vertical' />
            </Center>
            <div className="flex items-center gap-2">
                <Avatar src={user?.full_name} size="md" name={user?.full_name} />
                <div>
                    <p className="text-xs">ID: <span className="font-bold">{user?.id}</span></p>
                    <p className="font-bold w-[150px]">{user?.full_name}</p>
                    <p className="text-xs">{getGreeting()}</p>
                </div>
            </div>
        </div>
    );
};