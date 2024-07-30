class Node {
    constructor(value, parent = null, left = null, right = null) {
        this.value = value;
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.height = 0;
    }
}

class AVLTree {
    constructor() {
        this.origin = null;
        this.size = 0;
    }

    height(node) {
        return node ? node.height : -1;
    }
    /* insertion */
    insert(value) {
        this.origin = this._insert(this.origin, value);
    }

    _insert(node, value) {
        if (!node) {
            this.size++;
            return new Node(value);
        }

        if (value < node.value) {
            node.left = this._insert(node.left, value);
            node.left.parent = node;
        } else if (value > node.value) {
            node.right = this._insert(node.right, value);
            node.right.parent = node;
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        return this.rebalance(node);
    }
    /* deletion */
    remove(value) {
        this.origin = this._remove(this.origin, value);
    }

    _remove(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._remove(node.left, value);
        } else if (value > node.value) {
            node.right = this._remove(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left || node.right;
                this.size--;
            } else {
                const temp = this._max(node.left);
                node.value = temp.value;
                node.left = this._remove(node.left, temp.value);
            }
        }

        if (!node) return node;

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        return this.rebalance(node);
    }
    /* rebalancing */
    rebalance(node) {
        const balanceFactor = this.height(node.left) - this.height(node.right);

        if (balanceFactor > 1) {
            if (this.height(node.left.left) >= this.height(node.left.right)) {
                return this.rightRotate(node);
            } else {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        } else if (balanceFactor < -1) {
            if (this.height(node.right.right) >= this.height(node.right.left)) {
                return this.leftRotate(node);
            } else {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    }
    /* rotations */
    leftRotate(x) {
        const y = x.right;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.left = x;
        y.parent = x.parent;
        x.parent = y;

        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));
        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));

        return y;
    }

    rightRotate(y) {
        const x = y.left;
        y.left = x.right;
        if (x.right) x.right.parent = y;
        x.right = y;
        x.parent = y.parent;
        y.parent = x;

        y.height = 1 + Math.max(this.height(y.left), this.height(y.right));
        x.height = 1 + Math.max(this.height(x.left), this.height(x.right));

        return x;
    }

    _max(node) {
        while (node.right) node = node.right;
        return node;
    }

    toJSON(node = this.origin) {
        if (!node) return null;

        return {
            name: node.value,
            height: node.height,
            balanceFactor: this.height(node.left) - this.height(node.right),
            children: [this.toJSON(node.left), this.toJSON(node.right)].filter(Boolean)
        };
    }
}
