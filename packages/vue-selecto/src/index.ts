import { VueConstructor } from 'vue';
import VueSelecto from './VueSelecto';

declare global {
    interface Window {
        Vue: VueConstructor;
    }
}

export { VueSelecto };
