function getLinearLine([x1, y1]: number[], [x2, y2]: number[]) {
    // ax + by + c = 0
    let a = 0;
    let b = 0;
    let c = 0;

    if (x1 === x2) {
        // x = x1
        return [1, 0, -x1];
    } else if (y1 === y2) {
        // y = y1
        return [0, 1, -y1];
    } else {
        // a * x1 + b * y1 +c = 0
        // a * x2 + b * y2 +c = 0
        // a * (x1 - x2) + b * (y1 - y2) = 0
    }
}
describe("test hitTest 4 points", () => {
    it ("test rect vs rect", () => {
        const points1 = {
            pos1: [0, 0],
            pos2: [100, 0],
            pos3: [0, 100],
            pos4: [100, 100],
        };
        const points2 = {
            pos1: [120, 0],
            pos2: [200, 0],
            pos3: [50, 100],
            pos4: [150, 100],
        };

        const lines1 = [
            [points1.pos1, points1.pos2],
            [points1.pos2, points1.pos4],
            [points1.pos4, points1.pos3],
            [points1.pos3, points1.pos1],
        ];
        const lines2 = [
            [points2.pos1, points2.pos2],
            [points2.pos2, points2.pos4],
            [points2.pos4, points2.pos3],
            [points2.pos3, points2.pos1],
        ];

        lines1.map(line1 => {
            lines2.forEach(line2 => {
                // ax + by + c = 0
                // a * x1 + b * y1 + c = 0
                // a * x2 + b * y2 + c = 0
                // a * (x1 - x2) + b * (y1 - y2) = 0
                //
            });
        });
    });
    it ("test rect vs quadrangle", () => {

    });
});
