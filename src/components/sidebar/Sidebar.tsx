import React, { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { useResponsive } from "../../hooks/useResponsive";
import { MobileHeader } from "../header/MobileHeader";
import { RightCircleTwoTone } from "@ant-design/icons";
import {
  Home,
  LogOut,
  Columns3Cog,
  CircleAlert,
  GitMerge,
  BellDot,
  CircleDollarSign,
  CloudUpload,
  BanknoteArrowUp,
  Users2,
  Banknote,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../icons/logo";
import { Avatar } from "@chakra-ui/react";

const { Content, Sider } = Layout;

interface OverlayProps {
  show: boolean;
  onOverlayClick: () => void;
}

export const Overlay = ({ show, onOverlayClick }: OverlayProps) => {
  return (
    <div
      className={`fixed h-0 w-screen z-10 ${
        show ? "visible backdrop-blur-sm h-screen" : ""
      }`}
      onClick={onOverlayClick}
    ></div>
  );
};

const SideBar = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // useEffect(() => {
  //   if (user?.id) {
  //     fetchUnreadCount(user.id);
  //   }
  // }, [user?.id, fetchUnreadCount]);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <Home className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Dashboard",
    },
    {
      key: "/members",
      icon: <Users2 className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Members",
    },
    {
      key: "/savings",
      icon: (
        <Banknote color="white" className={`${collapsed ? "!mt-2" : ""}`} />
      ),
      label: "Savings",
    },
    {
      key: "/loan",
      icon: <BanknoteArrowUp className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Loans",
    },
    {
      key: "/request",
      icon: <GitMerge className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Requests",
    },
    {
      key: "/upload",
      icon: <CloudUpload className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Uploads",
    },
    {
      key: "/termination",
      icon: <CircleDollarSign className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Termination",
    },
    {
      key: "/account-management",
      icon: <Columns3Cog className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Account Management",
    },
    {
      key: "/report",
      icon: <CircleAlert className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Report",
    },
    // {
    //   key: "/admin-user",
    //   icon: <MailCheckIcon className={`${collapsed ? "!mt-2" : ""}`} />,
    //   label: "Admin-User",
    // },

    // {
    //   key: "/members",
    //   icon: <UsersRound className={`${collapsed ? "!mt-2" : ""}`} />,
    //   label: "Members",
    // },
    // {
    //   key: "/settings",
    //   icon: <Cog className={`${collapsed ? "!mt-2" : ""}`} />,
    //   label: "Settings",
    // },
    // {
    //   key: "/notifications",
    //   icon: <BellDot className={`${collapsed ? "!mt-2" : ""}`} />,
    //   label: "Notifications",
    //   hasNotificationCount: true,
    // },
    // {
    //   key: "/tasks",
    //   icon: <ClipboardList className={`${collapsed ? "!mt-2" : ""}`} />,
    //   label: "Tasks",
    //   hasPendingTaskCount: true
    // },
    {
      key: "/",
      icon: <LogOut className={`${collapsed ? "!mt-2" : ""}`} />,
      label: "Log Out",
    },
  ];

  const menuItemsWithSubmenus = menuItems.map((item) => {
    return {
      key: item.key,
      icon: React.cloneElement(item.icon, {
        isSelected: item.key === currentPath,
      }),
      label: (
        <Link
          color="white"
          to={item.key}
          className="flex items-center justify-between w-full"
        >
          <span>{item.label}</span>
          {/* {item.hasNotificationCount && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium ml-2">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {item.hasPendingTaskCount && pendingTaskCount !== null && pendingTaskCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium ml-2">
              {pendingTaskCount > 99 ? '99+' : pendingTaskCount}
            </span>
          )} */}
        </Link>
      ),
    };
  });

  const { isDesktop, mobileOnly, tabletOnly } = useResponsive();

  const isCollapsible = useMemo(
    () => mobileOnly && tabletOnly,
    [mobileOnly, tabletOnly]
  );

  return (
    <Layout hasSider className="h-screen">
      <Sider
        breakpoint="lg"
        trigger={null}
        collapsed={!isDesktop && collapsed}
        collapsedWidth={tabletOnly ? 80 : 0}
        onCollapse={() => setCollapsed(!collapsed)}
        collapsible={isCollapsible}
        width={240}
        style={{
          overflow: "auto",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "#982323",
          zIndex: 30,
          boxShadow: "-3px 0 5px 0 #555",
        }}
      >
        <div className="flex items-center justify-center relative">
          <Link to="/">
            <Logo className="mt-4 mb-4 w-15" />
          </Link>
          <div
            className="hidden md:block lg:hidden absolute right-4 z-20 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <RightCircleTwoTone
              twoToneColor="#9600ad"
              className={`text-2xl z-[50] fixed transition duration-200 ${
                !collapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 mb-5">
          <Avatar size="xl" src={user?.full_name} name={user?.full_name} bg='green.300' />
          <p className="pt-4 text-white font-semibold">{user?.full_name}</p>
          <p className="text-white font-thin">Member</p>
        </div>

        <Menu
          theme="light"
          mode="inline"
          className="custom-menu"
          selectedKeys={[currentPath.startsWith("/post/") ? "/" : currentPath]}
          items={menuItemsWithSubmenus}
        />
        {/* <Link
          to="/settings/profile"
          className={`${currentPath === "/settings/profile"
            ? "profile-link-active"
            : "profile-link"
            } flex items-center gap-4 w-[90%] ml-2 pl-5 h-10 absolute bottom-10 md:bottom-5 text-base text-[#474E67] p-4 hover:text-[#474E67]`}
        >
          <Logo />
          {!collapsed && <span>Profile</span>}
        </Link> */}
      </Sider>
      {mobileOnly && (
        <Overlay
          show={!collapsed}
          onOverlayClick={() => setCollapsed(!collapsed)}
        />
      )}

      <Layout className={`${!collapsed ? "overflow-hidden" : ""}`}>
        {mobileOnly && (
          <MobileHeader
            toggleSider={() => setCollapsed(!collapsed)}
            isSiderOpened={!collapsed}
          />
        )}
        <Content className="overflow-auto">
          <div className="p-2 md:p-6 md:ml-16 lg:ml-[240px] min-h-screen bg-white">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
