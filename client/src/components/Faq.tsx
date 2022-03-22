import React from 'react';
import {Card, Container, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";

const Faq = () => {
    return (
        <Container sx={{my: 2}}>
            <Card sx={{p: 1, mt: 2, background: grey[200]}}>
                <Typography fontWeight={'bold'}>Как верифицировать аккаунт?</Typography>
                <Typography>В личном аккаунте необходимо ввести ваш SteamID64</Typography>
            </Card>
            <Card sx={{p: 1, mt: 2, background: grey[200]}}>
                <Typography fontWeight={'bold'}>В чем преимущества верифицированного аккаунта?</Typography>
                <Typography>Верификация позволяет с помощью SteamAPI отслеживать изменения на аккаунтах пользователей. Что является доказательством отказа от игр.</Typography>
            </Card>
            <Card sx={{p: 1, mt: 2, background: grey[200]}}>
                <Typography fontWeight={'bold'}>Что делает кнопка "проверить"?</Typography>
                <Typography>Позволяет любому пользователю раз в 24 часа проверить верифицированных пользователей на изменения в их аккаунтах.</Typography>
            </Card>
            <Card sx={{p: 1, mt: 2, background: grey[200]}}>
                <Typography fontWeight={'bold'}>Я не играю в "xxx" игру уже месяц, но на сайте показывает 0 ч.?</Typography>
                <Typography>SteamAPI не позволяет отследить дату последнего запуска игры, по этой причине при выборе игры отсчет ведется с нуля.</Typography>
            </Card>
        </Container>
    );
};

export default Faq;
