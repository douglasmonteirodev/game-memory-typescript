import { GridItemType } from "../../types/GridItemType";
import * as C from "./styles";
import b7svg from "../../svgs/b7.svg";
import { items } from "../../data/items";

type Props = {
    item: GridItemType;
    onClick: () => void;
};

const GridItem = ({ item, onClick }: Props) => {
    return (
        <C.Container showBg={item.permanentShow || item.show} onClick={onClick}>
            {!item.permanentShow && !item.show && (
                <C.Icon src={b7svg} alt='logo' opacity={0.1} />
            )}

            {(item.permanentShow || item.show) && item.item !== null && (
                <C.Icon src={items[item.item].icon} alt='hydasfg' />
            )}
        </C.Container>
    );
};

export default GridItem;
