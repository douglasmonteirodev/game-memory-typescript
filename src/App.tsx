import { useEffect, useState } from "react";
import * as C from "./App.styles";
import { items } from "./data/items";
import { GridItemType } from "./types/GridItemType";

import logoImage from "./assets/devmemory_logo.png";
import RestartIcon from "./svgs/restart.svg";

import Button from "./components/Button";
import InfoItem from "./components/InfoItem";
import GridItem from "./components/GridItem";
import { formatTime } from "./helpers/formatTime";

const App = () => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount] = useState(0);
    const [showCount, setShowCount] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => {
        resetAndCreateGrid();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (playing) {
                setTimeElapsed(timeElapsed + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed]);

    // verificar se as cartas vridadas sãó iguaisl
    useEffect(() => {
        if (showCount === 2) {
            let opened = gridItems.filter((item) => item.show === true);

            if (opened.length === 2) {
                //v1 Se são iguais, tornalos permanentes

                if (opened[0].item === opened[1].item) {
                    let tmpGrid = [...gridItems];

                    for (let i in tmpGrid) {
                        if (tmpGrid[i].show) {
                            tmpGrid[i].permanentShow = true;
                            tmpGrid[i].show = false;
                        }
                    }
                    setGridItems(tmpGrid);
                    setShowCount(0);
                }

                //V2 se não for iguais
                else {
                    setTimeout(() => {
                        let tmpGrid = [...gridItems];
                        for (let i in tmpGrid) {
                            tmpGrid[i].show = false;
                        }
                        setGridItems(tmpGrid);
                        setShowCount(0);
                    }, 1000);
                }

                setMoveCount((moveCount) => moveCount + 1);
            }
        }
    }, [showCount, gridItems]);

    //Verificar game over
    useEffect(() => {
        if (
            moveCount > 0 &&
            gridItems.every((item) => item.permanentShow === true)
        ) {
            setPlaying(false);
        }
    }, [moveCount, gridItems]);

    const resetAndCreateGrid = () => {
        //Passo 1 -resetar o jogo
        setTimeElapsed(0);
        setMoveCount(0);
        setShowCount(0);

        // Passo 2 - Criar o grid

        //2.1 criar um grid vazio
        let tmpGrid: GridItemType[] = [];

        for (let i = 0; i < items.length * 2; i++) {
            tmpGrid.push({
                item: null,
                show: false,
                permanentShow: false,
            });
        }
        //2.2 Preencher o grid
        for (let w = 0; w < 2; w++) {
            for (let i = 0; i < items.length; i++) {
                let pos = -1;
                while (pos < 0 || tmpGrid[pos].item !== null) {
                    pos = Math.floor(Math.random() * (items.length * 2));
                }
                tmpGrid[pos].item = i;
            }
        }

        //2.3 Jogar no state
        setGridItems(tmpGrid);

        //3 Começar o jogo
        setPlaying(true);
    };

    const handleItemClick = (index: number) => {
        if (playing && index !== null && showCount < 2) {
            let tmpGrid = [...gridItems];
            if (!tmpGrid[index].permanentShow && !tmpGrid[index].show) {
                tmpGrid[index].show = true;
                setShowCount(showCount + 1);
            }
            setGridItems(tmpGrid);
        }
    };

    return (
        <C.Container>
            <C.Info>
                <C.LogoLink href=''>
                    <img src={logoImage} width='200' alt='logo' />
                </C.LogoLink>
                <C.InfoArea>
                    <InfoItem label='Tempo' value={formatTime(timeElapsed)} />
                    <InfoItem label='Movimentos' value={moveCount.toString()} />
                </C.InfoArea>
                <Button
                    label='Reiniciar'
                    icon={RestartIcon}
                    onClick={resetAndCreateGrid}
                />
            </C.Info>
            <C.GridArea>
                <C.Grid>
                    {gridItems.map((item, index) => (
                        <GridItem
                            key={index}
                            item={item}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </C.Grid>
            </C.GridArea>
        </C.Container>
    );
};

export default App;
