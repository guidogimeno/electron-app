import React, { useState } from 'react';

function Tabs({ children }) {
    const [selectedTab, setSelectedTab] = useState(0);

    function handleTabClick(index) {
        setSelectedTab(index);
    };

    return (
        <div className="tabs">
            <TabList tabs={children} selectedTab={selectedTab} onTabClick={handleTabClick} />
            <TabContent tabs={children} selectedTab={selectedTab} />
        </div>
    );
}

function TabList({ tabs, selectedTab, onTabClick }) {
    return (
        <ul className="tab-list">
            {tabs.map((tab, index) => (
                <TabTrigger key={index} tab={tab} selected={selectedTab === index} onClick={() => onTabClick(index)} />
            ))}
        </ul>
    );
}


function TabTrigger({ tab, selected, onClick }) {
    return (
        <li className={`tab-trigger ${selected ? 'active' : ''}`} onClick={onClick}>
            {tab.props.label}
        </li>
    );
}


function TabContent({ tabs, selectedTab }) {
    return (
        <div className="tab-content">
            {tabs.map((tab, index) => (
                <div key={index} className={`tab-pane ${selectedTab === index ? 'active' : ''}`}>
                    {tab.props.children}
                </div>
            ))}
        </div>
    );
}

function Tab({ children, label }) {
    return {
        label,
        content: children,
    };
}

export default Tab;

export {
    Tabs,
    Tab,
    TabList,
    TabTrigger,
    TabContent
}
