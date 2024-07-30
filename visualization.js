const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const g = svg.append("g").attr("transform", "translate(40,0)");

const tree = d3.tree().size([height, width - 160]);

const avl = new AVLTree();
avl.insert(30);
avl.insert(20);
avl.insert(40);
avl.insert(10);
avl.insert(25);
avl.insert(35);
avl.insert(50);

function update() {
    const data = avl.toJSON();
    const root = d3.hierarchy(data);
    tree(root);

    g.selectAll(".link").remove();
    g.selectAll(".node").remove();

    const link = g.selectAll(".link")
        .data(root.descendants().slice(1));

    link.enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    const node = g.selectAll(".node")
        .data(root.descendants());

    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeEnter.append("circle")
        .attr("r", 10);

    nodeEnter.append("text")
        .attr("dy", 3)
        .attr("x", function(d) { return d.children ? -12 : 12; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.data.name; });

    nodeEnter.append("text")
        .attr("dy", -15)
        .attr("x", function(d) { return d.children ? -12 : 12; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .style("fill", "red")
        .text(function(d) { return "H:" + d.data.height; });

    nodeEnter.append("text")
        .attr("dy", 15)
        .attr("x", function(d) { return d.children ? -12 : 12; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .style("fill", "blue")
        .text(function(d) { return "BF:" + d.data.balanceFactor; });
}

update();

function insertAndUpdate(value) {
    avl.insert(value);
    update();
}

function removeAndUpdate(value) {
    avl.remove(value);
    update();
}

function insertValue() {
    const value = document.getElementById('valueInput').value;
    if (value) {
        insertAndUpdate(parseInt(value));
        document.getElementById('valueInput').value = '';
    }
}

function removeValue() {
    const value = document.getElementById('valueInput').value;
    if (value) {
        removeAndUpdate(parseInt(value));
        document.getElementById('valueInput').value = '';
    }
}
