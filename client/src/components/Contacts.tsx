import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Contacts = () => {
    return (
        <Container sx={{my: 2}}>
            <img src="./vadim.jpg" alt=""/>
            <Typography variant={'body1'}>Дизайн и Программирование: Вадим Янущик<b>*</b></Typography>
            <Typography variant={'body1'}>Контакты:</Typography>
            <Typography variant={'body1'}>email: <Link href={'mailto:vadim_wower@list.ru'}>vadim_wower@list.ru</Link></Typography>
            <Typography variant={'body1'}>vk: <Link href={'https://vk.com/malzeriy'}>https://vk.com/malzeriy</Link></Typography>
            <Typography variant={'body1'}>telegram: @fexi8</Typography>
            <Typography variant={'body1'} maxWidth={500} align={'justify'} marginTop={5}><b>Вадим Янущик</b> - студент 4 курса, Полесского государственного университета специальности: “Информационные технологии финансово-кредитной системы”. В поиске работы  на должность Junior Front-End Developer (React.js) =)</Typography>
        </Container>
    );
};

export default Contacts;
