import css from './seance-schema.module.css';
import {HallPlaceInfo} from "../../../scripts/constants";
import GeneralUtils from "../../../scripts/general-utils";


function log(...args: any[]) {
    GeneralUtils.log("SeanceSchemaUtils: ", ...args);
}

class SeanceSchemaUtils {
    static prepareBlockUnblockPlacesRequestBody(selectedPlaceList: Set<number>,
                                                seanceId: number) {
        log('Start preparing block places request body.');

        let blockPlacesRequestBody = {
            "seanceId": seanceId,
            "placeIdList" : [] as number[]
        };

        selectedPlaceList.forEach(placeId => {
            blockPlacesRequestBody.placeIdList.push(placeId);
        })

        log("Finish preparing block places request body:", blockPlacesRequestBody);
        return blockPlacesRequestBody;
    }

    static selectedPlaceListToString(selectedPlaceList: Set<number>){
        return Array.from(selectedPlaceList).join(' ')
    }


    static createCircleByParameters(circle: any,
                                    placeId: number,
                                    blocked: boolean,
                                    placeInfo: HallPlaceInfo,
                                    basePrice: number,
                                    vipPrice: number) {
        let x = placeInfo.coordX;
        let y = placeInfo.coordY;
        let vip = placeInfo.isVip;
        let price = basePrice;
        let r = "2.5%";
        circle.setAttributeNS(null, 'id', placeId);
        circle.setAttributeNS(null, 'cx', x + '%');
        circle.setAttributeNS(null, 'cy', y + '%');

        if (blocked === true) {
            r = "1.5%";
            circle.setAttributeNS(null, 'class', `${css.seat} ${css.blocked}`);
        } else if (vip === true) {
            circle.setAttributeNS(null, 'class', `${css.seat} ${css.vip}`);
            price = vipPrice;
        } else {
            circle.setAttributeNS(null, 'class', css.seat);
        }

        circle.setAttributeNS(null, 'r', r);
        circle.setAttributeNS(null, 'price', price);
        circle.setAttributeNS(null, 'blocked', blocked);
        circle.setAttributeNS(null, 'selected', false);
        log('finish creating circle by place id: ', placeId);
        return circle;
    }

    static createScreen(curvedLine: any, width: number, height: number) {
        let curvedLineCoord = `M ${0.20 * width} ${0.15 * height} 
        Q ${0.50 * width} ${0.05 * height} ${0.80 * width} ${0.15 * height}`;
        curvedLine.setAttribute('id', 'screen');
        curvedLine.setAttribute('d', curvedLineCoord);
        curvedLine.setAttribute('stroke', "grey");
        curvedLine.setAttribute('stroke-width', "1%");
        curvedLine.setAttribute('fill', "transparent");
        log('Finish creating screen.');
        return curvedLine;
    }

    static drawAllMovies(document: any, todayMoviesList: any) {
        log('Start drawing all movies.');
        let container = document.getElementById('todayMovies');

        for (const index of Object.keys(todayMoviesList)) {
            // create new element
            let movie = document.createElement('div');
            movie.setAttribute('class', "col-3 movie");
            movie.setAttribute('id', index);
            movie.textContent = todayMoviesList[index];
            log("_14", movie)
            container.appendChild(movie);
        }
        log('Finish drawing all movies.');
    }
}

export default SeanceSchemaUtils
