export const superAdminNavLinks = [
  {
    to: "/admin/home",
    icon: <i className="fa-solid fa-house"></i>,
    title: "Dashboard",
  },
  {
    to: "/admin/customers",
    icon: <i className="fa-solid fa-user"></i>,
    title: "Customer",
  },
    {
      to: "/admin",
      icon: <i className="fa-solid fa-id-card"></i>,
      title: "Profile",
      subBtn: ["Change Password"],
    },
  {
    to: "/admin/agents",
    icon: <i className="fa-solid fa-circle-user"></i>,
    title: "Agents",
  },
  {
    to: "/admin",
    icon: <i className="fa-solid fa-clone"></i>,
    title: "Features",
    subBtn: ["Categories", "Societies", "Marquee"],
  },
  {
    to: "/admin/promo",
    icon: <i className="fa-solid fa-tag"></i>,
    title: "Promotions",
    subBtn: ["Active", "Winners"],
  },
  {
    to: "/admin/invoices",
    icon: <i className="fa-solid fa-file-invoice"></i>,
    title: "Invoices",
  },
  {
    to: "/admin/expense",
    icon: <i className="fa-solid fa-chart-pie"></i>,
    title: "Expenses",
  },
  {
    to: "/admin/store",
    icon: <i className="fa-solid fa-shop"></i>,
    title: "Store",
  },
  {
    to: "/admin/blocked",
    icon: <i className="fa-solid fa-circle-xmark"></i>,
    title: "Blocked Users",
  },
  // {
  //   to: "/notfound",
  //   icon: <i className="fa-solid fa-wallet"></i>,
  //   title: "Wallets",
  //   span: "New",
  // },
  {
    to: "/endsession",
    icon: <i className="fa-solid fa-user-lock"></i>,
    title: "Log Out",
  },
];

export const subAdminNavLinks = [
  {
    to: "/agent/home",
    icon: <i className="fa-solid fa-house"></i>,
    title: "Dashboard",
  },
  {
    to: "/admin/customers",
    icon: <i className="fa-solid fa-user"></i>,
    title: "Customer",
  },
    {
      to: "/admin",
      icon: <i className="fa-solid fa-id-card"></i>,
      title: "Profile",
      subBtn: ["Change Password"],
    },
  {
    to: "/admin/invoices",
    icon: <i className="fa-solid fa-file-invoice"></i>,
    title: "Invoices",
  },
  {
    to: "/admin/expense",
    icon: <i className="fa-solid fa-chart-pie"></i>,
    title: "Expenses",
  },
  {
    to: "/admin/store",
    icon: <i className="fa-solid fa-shop"></i>,
    title: "Store",
  },
  {
    to: "/agent/wallet",
    icon: <i className="fa-solid fa-wallet"></i>,
    title: "Wallets",
    span: "New",
  },
  {
    to: "/endsession",
    icon: <i className="fa-solid fa-user-lock"></i>,
    title: "Log Out",
  },
];
export const financeNavLinks = [
  {
    to: "/finance/dashboard",
    icon: <i className="fa-solid fa-house"></i>,
    title: "Dashboard",
  },
    {
      to: "/admin",
      icon: <i className="fa-solid fa-id-card"></i>,
      title: "Profile",
      subBtn: ["Change Password"],
    },
  {
    to: "/finance",
    icon: <i className="fa-solid fa-file-invoice"></i>,
    title: "Invoices",
    subBtn: ["History", "Unverified"],
  },
  {
    to: "/finance/withdrawal",
    icon: <i className="fa-solid fa-money-bill"></i>,
    title: "Withdrawal",
    subBtn: ["History", "Requests"],
  },
  {
    to: "/endsession",
    icon: <i className="fa-solid fa-user-lock"></i>,
    title: "Log Out",
  },
];
