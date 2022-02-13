import React, {useEffect, useState} from 'react';
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
import {collection, getDocs, query, where, orderBy} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {TableProps} from "../interfaces/user";
import {a11yProps, daysWithOutGame} from "../helpers/LeaderTableHelpers";


const LeadersTable = () => {
    const [value, setValue] = React.useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [tables, setTables] = useState<TableProps[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        async function fetchTables() {
            const qGames = query(collection(db, "games"))
            const querySnapshotGames = await getDocs(qGames);

            let gameNames: string[] = [];

            querySnapshotGames.forEach(doc => {
                gameNames.push(doc.data().name)
            })

            const tempTable: TableProps[] = [];

            const qUsers = query(collection(db, "users"), orderBy("startDate", "asc"));
            const querySnapshotUsers = await getDocs(qUsers);

            let tableAll: TableProps = {
                name: 'Все',
                items: []
            };

            await Promise.all(querySnapshotUsers.docs.map(async (docUser) => {
                tableAll.items.push({
                    name: docUser.data().name,
                    isVerified: docUser.data().isVerified,
                    startDate: docUser.data().startDate.toDate(),
                    game: docUser.data().game
                })
            }))

            tempTable.push(tableAll);

            let tableVerified: TableProps = {
                name: 'Верифицированные',
                items: []
            }

            const qUsersVerified = query(collection(db, "users"), where("isVerified", "==", true));
            const querySnapshotUsersVerified = await getDocs(qUsersVerified)

            querySnapshotUsersVerified.forEach(doc => {
                tableVerified.items.push({
                    name: doc.data().name,
                    isVerified: doc.data().isVerified,
                    startDate: doc.data().startDate.toDate(),
                    game: doc.data().game
                })
            })

            tempTable.push(tableVerified)

            await Promise.all(gameNames.map(async (docGame) => {
                let qUsersGame = query(collection(db, "users"), where("game", "==", docGame));
                const querySnapshotUsersGame = await getDocs(qUsersGame);

                let table: TableProps = {
                    name: '',
                    items: []
                };
                table.name = docGame

                querySnapshotUsersGame.forEach(docUser => {
                    table.items.push({
                        name: docUser.data().name,
                        isVerified: docUser.data().isVerified,
                        startDate: docUser.data().startDate.toDate(),
                        game: docUser.data().game
                    })
                })
                tempTable.push(table);
            }))
            setTables(tempTable);
        }

        fetchTables();
    }, []);

    useEffect(() => {
        if(tables.length) {
            setIsLoading(false);
        }
    }, [tables]);


    if (isLoading) {
        return <CircularProgress sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%)'}}/>
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        table.items.length ? table.items.map((item, index) => (
                                            <TableRow
                                                key={index + 1}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {index + 1}.
                                                </TableCell>
                                                <TableCell align="right"
                                                           className={item.isVerified ? 'verified' : ''}>{item.name}
                                                </TableCell>
                                                <TableCell
                                                    align="right">{item.game}</TableCell>
                                                <TableCell
                                                    align="right">{daysWithOutGame(item.startDate)} д.</TableCell>
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
