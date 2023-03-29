export default function initialize_renderer(render: () => void) {

    let animationId: number;
    function animate() {
        render();
        animationId = requestAnimationFrame(animate);
    }

    function start() {
        animationId = requestAnimationFrame(animate)
    }

    function stop() {
        cancelAnimationFrame(animationId)
    }


    return { start, stop }
}