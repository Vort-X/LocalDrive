import { Typography } from "@mui/material";

const BoldText = ({children}) => {
    return (
        <Typography sx={{ fontWeight: '700' }}>
            {children}
        </Typography>
    )
}

export {BoldText}