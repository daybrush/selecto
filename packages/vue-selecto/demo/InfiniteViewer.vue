<template>
    <div class="app">
        <div class="container">
            <div class="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>Select in the Infinite Scroll Viewer.</h1>
            <p class="description">Selecting the scroll area area causes scrolling.</p>
            <button class="button reset" @click="resetScroll">Reset Scroll</button>
            <vue-selecto
                ref="selecto"
                dragContainer=".elements"
                v-bind:selectableTargets='[".selecto-area .cube"]'
                v-bind:hitRate='0'
                v-bind:selectByClick='true'
                v-bind:selectFromInside='false'
                v-bind:toggleContinueSelect='["shift"]'
                v-bind:ratio='0'
                v-bind:scrollOptions='scrollOptions'
                @dragStart="onDragStart"
                @select="onSelect"
                @scroll="onScroll"
            ></vue-selecto>

            <vue-infinite-viewer class="elements infinite-viewer" ref="viewer" @scroll="onViewerScroll">
                <div class="viewport selecto-area" id="selecto1">
                    <div class="cube" v-for="cube in cubes"></div>
                </div>
            </vue-infinite-viewer>
            <div class="empty elements"></div>
        </div>
    </div>
</template>
<style>
    html, body, #root {
        position: relative;
        margin: 0;
        padding: 0;
        height: 100%;
        color: #333;
        background: #fdfdfd;
    }
    
    .app {
        position: relative;
        min-height: 100%;
        padding: 10px 20px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
    
    .container {
        max-width: 800px;
        ;
    }
    
    body {
        background: #fff;
    }
    
    .logo {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0px auto;
        font-size: 0;
        text-align: left;
    }
    
    .logo.logos {
        width: 320px;
        text-align: center;
    }
    
    .logos .selecto {
        padding: 16px;
    }
    
    .logo img {
        position: relative;
        height: 100%;
        box-sizing: border-box;
    }
    
    .cube {
        display: inline-block;
        border-radius: 5px;
        width: 40px;
        height: 40px;
        margin: 4px;
        background: #eee;
        --color: #4af;
    }
    
    h1, .description {
        text-align: center;
    }
    
    .button {
        border: 1px solid #333;
        color: #333;
        background: transparent;
        appearance: none;
        -webkit-appearance: none;
        box-sizing: border-box;
        cursor: pointer;
        width: 120px;
        height: 42px;
        font-size: 14px;
        letter-spacing: 1px;
        transition: all ease 0.2s;
        margin: 0px 5px;
    }
    
    .button:hover {
        background: #333;
        color: white;
    }
    
    .elements {
        margin-top: 40px;
        border: 2px solid #eee;
    }
    
    .selecto-area {
        padding: 20px;
    }
    
    #selecto1 .cube {
        transition: all ease 0.2s;
    }
    
    .moveable #selecto1 .cube {
        transition: none;
    }
    
    .selecto-area .selected {
        color: #fff;
        background: var(--color);
    }
    
    .scroll {
        overflow: auto;
        padding-top: 10px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    .infinite-viewer, .scroll {
        width: 100%;
        height: 300px;
        box-sizing: border-box;
    }
    
    .infinite-viewer .viewport {
        padding-top: 10px;
    }
    
    .empty.elements {
        border: none;
    }
</style>
<script>
import { VueSelecto } from "../src/index";
import { VueInfiniteViewer } from "vue-infinite-viewer";

export default {
    components: {
        VueSelecto,
        VueInfiniteViewer,
    },
    data() {
        const cubes = [];

        for (let i = 0; i < 30 * 7; ++i) {
            cubes.push(i);
        }
        return {
            cubes,
            scrollOptions: {},
        };
    },
    methods: {
        onDragStart(e) {
            if (e.inputEvent.target.nodeName === "BUTTON") {
                return false;
            }
            return true;
        },
        onSelect(e) {
            e.added.forEach(el => {
                el.classList.add("selected");
            });
            e.removed.forEach(el => {
                el.classList.remove("selected");
            });
        },
        onScroll(e) {
            this.$refs.viewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
        
        },
        resetScroll() {
            this.$refs.viewer.scrollTo(0, 0);
        },
        onViewerScroll() {
            this.$refs.selecto.checkScroll();
        },
    },
    mounted() {
        const viewer = this.$refs.viewer;

        this.scrollOptions = {
            container: viewer.getContainer(),
            getScrollPosition: () => {
                return [
                    viewer.getScrollLeft(),
                    viewer.getScrollTop(),
                ];
            },
            throttleTime: 30,
            threshold: 0,
        };
    }
};
</script>