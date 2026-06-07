import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>ZenithAcad</h2>
            </div>

            <ul className="sidebar-menu">
                <li className="active">Dashboard</li>
                <li>All Courses</li>
                <li>Resources</li>
                <li>Chats</li>
                <li>Settings</li>
            </ul>
        </aside>
    );
};

export default Sidebar;