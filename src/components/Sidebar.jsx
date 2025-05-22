import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo_dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { FaUsers, FaUserTie, FaShip, FaBlog, FaRegCalendarAlt } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FiLogOut, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdFastfood, MdCategory, MdOutlineEventNote } from "react-icons/md";
import { BiCategoryAlt, BiMessage } from "react-icons/bi";
import { TbBrandAirbnb } from "react-icons/tb";
import { AiFillStar } from "react-icons/ai";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineStar } from "react-icons/ai";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { useAuth } from "../context/AuthContext";
import { Package } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccordionOpen = (value) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isPathActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    // Ensure exact path match or direct child path match
    return location.pathname === path || 
           (location.pathname.startsWith(path + '/') && 
            location.pathname.split('/').length === path.split('/').length + 1);
  };

  const isAccordionActive = (items) => {
    return items.some(subItem => 
      subItem.items.some(link => isPathActive(link.path))
    );
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <RxDashboard className="text-xl" />, type: "link" },
    {
      name: "User Management",
      icon: <FaUsers className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Users",
          icon: <FaUsers className="text-xl" />,
          items: [
            { name: "All Users", path: "/users" },
            { name: "Add User", path: "/users/add" }
          ]
        },
        // {
        //   name: "Merchants",
        //   icon: <FaUserTie className="text-xl" />,
        //   items: [
        //     { name: "All Merchants", path: "/merchants" },
        //     { name: "Add Merchant", path: "/merchants/add" }
        //   ]
        // }
      ]
    },
    {
      name: "Boats",
      icon: <FaShip className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Regular Boats",
          icon: <FaShip className="text-xl" />,
          items: [
            { name: "All Boats", path: "/boats/yachts" },
            { name: "Add Boat", path: "/boats/yachts/add" }
          ]
        },
        {
          name: "F1 Boats",
          icon: <FaShip className="text-xl" />,
          items: [
            { name: "All F1 Boats", path: "/boats/f1yachts" },
            { name: "Add F1 Boat", path: "/boats/f1yachts/add" }
          ]
        },
        // {
        //   name: "New Year Boats",
        //   icon: <FaRegCalendarAlt className="text-xl" />,
        //   items: [
        //     { name: "All New Year Boats", path: "/boats/newyear" },
        //     { name: "Add New Year Boat", path: "/boats/newyear/add" }
        //   ]
        // }
      ]
    },
    {
      name: "Experiences",
      icon: <FaShip className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Experiences",
          icon: <FaShip className="text-xl" />,
          items: [
            { name: "All Experiences", path: "/experiences/regular-exp" },
            { name: "Add Experiences", path: "/experiences/regular-exp/add" }
          ]
        },
        // {
        //   name: "F1 Experiences",
        //   icon: <FaShip className="text-xl" />,
        //   items: [
        //     { name: "All F1 Experiences", path: "/experiences/f1-exp" },
        //     { name: "Add F1 Experiences", path: "/experiences/f1-exp/add" }
        //   ]
        // },
     
      ]
    },
    {
      name: "Event Management",
      icon: <MdOutlineEventNote className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Events",
          icon: <MdOutlineEventNote className="text-xl" />,
          items: [
            { name: "All Events", path: "/events" },
            { name: "Add Event", path: "/events/add" }
          ]
        },
        {
          name: "Packages",
          icon: <Package className="text-xl" />,
          items: [
            { name: "All Packages", path: "/packages" },
            { name: "Add Package", path: "/packages/add" },

          ]
        }
      ]
    },
 
    {
      name: "Bookings",
      icon: <MdOutlineEventNote className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Bookings",
          icon: <MdOutlineEventNote className="text-xl" />,
          items: [
            { name: "Boat Bookings", path: "/boat-bookings/yachts" },
            { name: "f1 Boat Bookings", path: "/boat-bookings/f1yachts" },
            { name: "Experience Bookings", path: "/experience-bookings/regular-exp" },
            { name: "Events Bookings", path: "/events-bookings/all-events" },


            // { name: "Event Bookings", path: "/event-bookings" },
          ]
        }
      ]
    },
    {
      name: "Inclusions",
      icon: <GiNotebook className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Inclusions",
          icon: <GiNotebook className="text-xl" />,
          items: [
            { name: "All Inclusions", path: "/inclusions" },
            { name: "Add Inclusion", path: "/inclusions/add" }
          ]
        }
      ]
    },
    {
      name: "Food Menu",
      icon: <MdFastfood className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Extras",
          icon: <MdFastfood className="text-xl" />,
          items: [
            { name: "All Foods ", path: "/extras" },
            { name: "Food and Beverages", path: "/extras/food-and-beverages" },
            { name: "Water Sports", path: "/extras/water-sports" },
            { name: "Miscellaneous", path: "/extras/misc" },
            { name: "Extra", path: "/extras/extra" },
            { name: "Add Foods", path: "/extras/add" }
          ]
        }
      ]
    },
    {
      name: "Posts & Blogs",
      icon: <FaBlog className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Blogs",
          icon: <FaBlog className="text-xl" />,
          items: [
            { name: "All Blogs", path: "/blogs" },
            { name: "Add Blog", path: "/blogs/add" }
          ]
        }
      ]
    },
    // {
    //   name: "Wallet",
    //   icon: <GiNotebook className="text-xl" />,
    //   type: "accordion",
    //   items: [
    //     {
    //       name: "Wallet",
    //       icon: <GiNotebook className="text-xl" />,
    //       items: [
    //         // { name: "Wallet Details", path: "/wallet" },
    //         { name: "Add Money", path: "/wallet/add-money" }
    //       ]
    //     }
    //   ]
    // },
   
    {
      name: "Brands",
      icon: <TbBrandAirbnb className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Brands",
          icon: <TbBrandAirbnb className="text-xl" />,
          items: [
            { name: "All Brands", path: "/brands" },
            { name: "Add Brand", path: "/brands/add" }
          ]
        }
      ]
    },
  
    {
      name: "Categories",
      icon: <BiCategoryAlt className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Categories",
          icon: <MdCategory className="text-xl" />,
          items: [
            { name: "All Categories", path: "/categories" },
            { name: "Add Category", path: "/categories/add" },
          ]
        }
      ]
    },
  
    {
      name: "Features",
      icon: <AiFillStar className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Features",
          icon: <AiFillStar className="text-xl" />,
          items: [
            { name: "All Features", path: "/features" },
            { name: "Add Feature", path: "/features/add" }
          ]
        }
      ]
    },
  
    {
      name: "Specifications",
      icon: <MdCategory className="text-xl" />,
      type: "accordion",
      items: [
        {
          name: "Specifications",
          icon: <MdCategory className="text-xl" />,
          items: [
            { name: "All Specifications", path: "/specifications" },
            { name: "Add Specification", path: "/specifications/add" }
          ]
        }
      ]
    },
    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <AiOutlineStar className="text-xl" />,
      type: "link"
    },
    { name: "Inbox", path: "/chat", icon: <BiMessage className="text-xl" />, type: "link" },
    { name: "Logout", path: "/login", icon: <FiLogOut className="text-xl" />, type: "link" }
  ];

  const renderMenuItem = (item, index) => {
    if (item.type === "link") {
      return (
        <NavLink
          to={item.path}
          key={item.name}
          className={({ isActive }) =>
            `block py-2 px-4 w-full text-lg rounded-lg flex gap-2 items-center ${
              isActive ? "bg-[#BEA355]" : "hover:bg-gray-700"
            }`
          }
          onClick={() => {
            toggleSidebar();
            if (item.name === "Logout") {
              handleLogout();
            }
          }}
        >
          {item.icon} {item.name}
        </NavLink>
      );
    }

    if (item.type === "accordion") {
      const isActive = isAccordionActive(item.items);
      
      return (
        <Accordion
          key={item.name}
          open={openAccordion === index || isActive}
        >
          <AccordionHeader
            onClick={() => handleAccordionOpen(index)}
            className={`py-2 px-2 w-full text-lg rounded-lg flex items-center gap-2 text-white hover:bg-gray-700 transition ${
              isActive ? "bg-[#BEA355]" : ""
            }`}
          >
            {item.icon}
            <span className="flex-1 text-base">{item.name}</span>
            {openAccordion === index || isActive ? (
              <FiChevronDown className="text-lg" />
            ) : (
              <FiChevronRight className="text-lg" />
            )}
          </AccordionHeader>
          <AccordionBody className="py-2">
            {item.items.map((subItem) => (
              <div key={subItem.name} className="ml-4 mb-2">
                <div className={`font-medium mb-2 text-white flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-700 transition`}>
                  {subItem.icon} <span className="text-base">{subItem.name}</span>
                </div>
                {subItem.items.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `block py-2 px-4 text-base mb-1 rounded-lg ml-6 ${
                        isActive ? "bg-[#BEA355] text-white" : "text-white hover:bg-gray-700 transition"
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            ))}
          </AccordionBody>
        </Accordion>
      );
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-screen sticky top-0 w-[275px] bg-black text-white hidden lg:flex flex-col">
        <div className="p-6">
          <img src={logo} alt="takeoff yachts" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 sidebar-scroll">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-[280px] bg-black text-white z-50 overflow-y-auto sidebar-scroll">
            <div className="p-6">
              <img src={logo} alt="takeoff yachts" className="w-[150px] h-[50px]" />
            </div>
            <nav className="px-4">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </nav>
          </div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          ></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
