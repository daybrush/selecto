import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import ContinueSelectKeyWithDeselect from "./apps/ContinueSelectKeyWithDeselect";
import RawContinueSelectKeyWithDeselect from "!!raw-loader!./apps/ContinueSelectKeyWithDeselect";


const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Continue to select like window desktop icons", () => {
    return <ContinueSelectKeyWithDeselect />;
}, {
    preview: [
        {
            tab: "React",
            template: RawContinueSelectKeyWithDeselect,
            language: "tsx",
        },
        // {
        //     tab: "HTML",
        //     template: HTML_TEMPLATE,
        //     language: "html",
        //     knobs: {
        //         title: `Continue to select through the toggle key.`,
        //         description: `The toggle key allows you to select continuously with the currently selected target.`,
        //         selectableTargets: [".selecto-area .cube"],
        //     },
        // },
        // {
        //     tab: "CSS",
        //     template: CSS_TEMPLATE,
        //     language: "css",
        // },
        // ...PREVIEWS_TEMPLATE(
        //     ["selectableTargets", "hitRate", "selectByClick", "selectFromInside", "toggleContinueSelect", "ratio"],
        //     {
        //         select: SELECT_EVENT_TEMPLATE,
        //     },
        // ),
    ],
});

