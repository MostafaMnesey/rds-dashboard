// Centralized AntD theme — matches RDS visual identity 1:1
export const antdTheme = {
    token: {
        // Brand colors
        colorPrimary: "#68bc52",
        colorSuccess: "#68bc52",
        colorError: "#ef4444",
        colorWarning: "#f59e0b",
        colorInfo: "#3b82f6",

        // Text
        colorText: "#2d2d2d",
        colorTextSecondary: "#93979a",
        colorTextTertiary: "#93979a",
        colorTextPlaceholder: "rgba(147, 151, 154, 0.7)",

        // Backgrounds & borders
        colorBgBase: "#ffffff",
        colorBgContainer: "#ffffff",
        colorBgElevated: "#ffffff",
        colorBgLayout: "#f4f3f0",
        colorBorder: "rgba(0, 0, 0, 0.08)",
        colorBorderSecondary: "rgba(0, 0, 0, 0.05)",

        // Typography
        fontFamily: "'Poppins', sans-serif",
        fontSize: 14,

        // Radius
        borderRadius: 12,
        borderRadiusLG: 16,
        borderRadiusSM: 8,

        // Sizing
        controlHeight: 44,
        controlHeightLG: 48,
        controlHeightSM: 36,

        // Shadow
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        boxShadowSecondary: "0 8px 24px rgba(0, 0, 0, 0.06)",
    },
    components: {
        Button: {
            controlHeight: 44,
            fontWeight: 600,
            primaryShadow: "0 8px 20px rgba(104, 188, 82, 0.18)",
        },
        Input: {
            controlHeight: 44,
            activeBorderColor: "#68bc52",
            hoverBorderColor: "rgba(0, 0, 0, 0.18)",
            activeShadow: "0 0 0 3px rgba(104, 188, 82, 0.12)",
        },
        Select: {
            controlHeight: 44,
            optionSelectedBg: "rgba(104, 188, 82, 0.08)",
            optionSelectedColor: "#2d2d2d",
            optionActiveBg: "rgba(0, 0, 0, 0.03)",
        },
        DatePicker: {
            controlHeight: 44,
            activeBorderColor: "#68bc52",
        },
        Table: {
            headerBg: "#fafaf9",
            headerColor: "#93979a",
            headerSplitColor: "transparent",
            borderColor: "rgba(0, 0, 0, 0.05)",
            rowHoverBg: "rgba(0, 0, 0, 0.02)",
            cellPaddingBlock: 16,
            cellPaddingInline: 20,
            fontSize: 14,
        },
        Modal: {
            borderRadiusLG: 20,
            paddingContentHorizontalLG: 24,
            titleFontSize: 18,
        },
        Drawer: {
            paddingLG: 24,
        },
        Pagination: {
            itemActiveBg: "#68bc52",
            itemSize: 36,
            borderRadius: 10,
        },
        Tooltip: {
            colorBgSpotlight: "#2d2d2d",
            borderRadius: 8,
        },
        Tabs: {
            itemActiveColor: "#68bc52",
            itemSelectedColor: "#68bc52",
            itemHoverColor: "#2d2d2d",
            inkBarColor: "#68bc52",
        },
        Switch: {
            colorPrimary: "#68bc52",
            colorPrimaryHover: "#5aa847",
        },
        Checkbox: {
            colorPrimary: "#68bc52",
            borderRadiusSM: 6,
        },
        Radio: {
            colorPrimary: "#68bc52",
        },
        Tag: {
            borderRadiusSM: 999,
            defaultBg: "rgba(0, 0, 0, 0.05)",
            defaultColor: "#93979a",
        },
        Popconfirm: {
            borderRadius: 12,
        },
        Spin: {
            colorPrimary: "#68bc52",
        },
    },
};