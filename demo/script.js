function startDemo() {

    var canvas = document.getElementById("canvas");

    var pytree = new Pytree(canvas, 200, 9, 0.5 * Math.sqrt(2.0));
    pytree.render();

}