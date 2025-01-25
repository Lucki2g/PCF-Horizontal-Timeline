import * as React from 'react'

export interface ActivityInformation {
    color: string;
}

export default function Icon({ name }: { name: string }) {

    let svgElement;

    switch (name) {
        case "task":
            svgElement = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M1792 256v1792H256V256h512q0-53 20-99t55-82 81-55 100-20q53 0 99 20t82 55 55 81 20 100h512zM640 384v128h768V384h-256V256q0-27-10-50t-27-40-41-28-50-10q-27 0-50 10t-40 27-28 41-10 50v128H640zm1024 0h-128v256H512V384H384v1536h1280V384zm-405 335q42 0 78 15t64 42 42 63 16 78q0 39-15 76t-43 65l-526 531-358 68 75-351 526-530q28-28 65-42t76-15zm51 249q21-23 21-51 0-31-20-50t-52-20q-14 0-27 4t-23 15l-499 503-27 126 129-25 498-502z"></path>
                </svg>
            );
            break;
        case 'appointment':
            svgElement = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M768 768h128v128H768V768zm384 768h128v128h-128v-128zm384-768h128v128h-128V768zm-384 0h128v128h-128V768zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zm1152 0h128v128h-128v-128zm-384 0h128v128h-128v-128zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zm1152 0h128v128h-128v-128zm-384 0h128v128h-128v-128zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zM2048 128v1792H0V128h384V0h128v128h1024V0h128v128h384zM128 256v256h1792V256h-256v128h-128V256H512v128H384V256H128zm1792 1536V640H128v1152h1792z"></path>
                </svg>
            )
            break;
        case 'email':
            svgElement = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M2048 384v1280H0V384h2048zM143 512l881 441 881-441H143zm1777 1024V648l-896 447-896-447v888h1792z"></path>
                </svg>
            )
            break;
        case 'phonecall':
            svgElement = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M1607 1213q44 0 84 16t72 48l220 220q31 31 47 71t17 85q0 44-16 84t-48 72l-14 14q-54 54-99 96t-94 70-109 44-143 15q-125 0-257-39t-262-108-256-164-237-207-206-238-162-256T38 775 0 523q0-83 14-142t43-108 70-93 96-99l16-16q31-31 71-48t85-17q44 0 84 17t72 48l220 220q31 31 47 71t17 85q0 44-15 78t-37 63-48 51-49 45-37 44-15 49q0 38 27 65l551 551q27 27 65 27 26 0 48-15t45-37 45-48 51-49 62-37 79-15zm-83 707q72 0 120-13t88-39 76-64 85-86q27-27 27-65 0-18-14-42t-38-52-51-55-56-54-51-47-37-35q-27-27-66-27-26 0-48 15t-44 37-45 48-52 49-62 37-79 15q-44 0-84-16t-72-48L570 927q-31-31-47-71t-17-85q0-44 15-78t37-63 48-51 49-46 37-44 15-48q0-39-27-66-13-13-34-36t-47-51-54-56-56-52-51-37-43-15q-38 0-65 27l-85 85q-37 37-64 76t-40 87-14 120q0 112 36 231t101 238 153 234 192 219 219 190 234 150 236 99 226 36z"></path>
                </svg>
            )
            break;
    }

    return (
        <div className='w-3.5 h-3.5 z-10 duration-500 transition-colors fill-dynamics-text group-hover:fill-white'>
            {svgElement}
        </div>
    )
}
