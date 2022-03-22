import React, {useEffect} from 'react';
import Container from "@mui/material/Container";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TabPanel from "./TabPanel";
import {a11yProps, tableTimeWithoutGame} from "../helpers/LeaderTableHelpers";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {fetchLeadersTable} from "../redux/features/leaderTableSlice";
import CheckVerifiedButton from "./CheckVerifiedButton";
import {Link} from "@mui/material";
import {ReactComponent as SteamIcon} from "../assets/steam.svg";
import Loader from "./Loader";

const LeadersTable = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = React.useState(0);
    const {tables, isLoading} = useAppSelector(state => state.tables);
    const {isAuth, user} = useAppSelector(state => state.user)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(fetchLeadersTable());
    }, []);

    if (isLoading) {
        return <Loader/>
    }

    return (
        <Container sx={{my: 2}}>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs ladder" variant='scrollable'>
                        {tables.map((gameTab, index) => (
                            <Tab key={gameTab.name} label={gameTab.name} {...a11yProps(index + 2)} />
                        ))}
                    </Tabs>
                </Box>
                <CheckVerifiedButton/>
                {tables.map((table, index) => (
                    <TabPanel value={value} index={index} key={index}>
                        <TableContainer sx={{maxWidth: 650, mx: 'auto', border: 1, borderColor: 'secondary.main'}}
                                        component={Paper}>
                            <Table sx={{whiteSpace: 'nowrap'}} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 'bold'}}>pos.</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} align="right">Имя</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} align="right">Игра</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} align="right">Кол-во дней</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} align="right">Звание</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        table.items.length ? table.items.map((item, index) => (
                                            <TableRow
                                                key={index + 1}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                className={isAuth && user && item.id === user?.id ? 'filled' : ''}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {index + 1}.
                                                </TableCell>
                                                <TableCell align="right">{item.name}
                                                    {item.steamID && <Link target={'_blank'} sx={{pl: 1}} href={`http://steamcommunity.com/profiles/${item.steamID}`}><SteamIcon/></Link>}
                                                </TableCell>
                                                <TableCell
                                                    align="right">{item.game}</TableCell>
                                                <TableCell
                                                    align="right">{item.startDate && tableTimeWithoutGame(new Date(item.startDate))}</TableCell>
                                                <TableCell
                                                    align="right">{item.rank}</TableCell>
                                            </TableRow>
                                        )) : (<TableRow>
                                            <TableCell colSpan={4}>Пусто</TableCell>
                                        </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                ))}
            </Box>
        </Container>
    );
};

export default LeadersTable;
