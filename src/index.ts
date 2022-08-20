import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    addBasePlugins,
    ITexture,
    CameraViewPlugin,
    CameraView,
    Vector3,
    BufferGeometry,
    MeshStandardMaterial2,
    Mesh,
    AssetImporter
} from "webgi";

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger"

import "./styles.css";

async function setupViewer(){

    // scene buttons
    const btn1 = document.querySelector('.btn1') as HTMLButtonElement
    const btn2 = document.querySelector('.btn2') as HTMLButtonElement
    const btn3 = document.querySelector('.btn3') as HTMLButtonElement
    const btn4 = document.querySelector('.btn4') as HTMLButtonElement
    const btnReset = document.querySelector('.resetBtn') as HTMLButtonElement
    const loader = document.querySelector('.loader')! as HTMLDivElement
    const container = document.querySelector('.container') as HTMLDivElement

    const viewerContainer = document.getElementById('webgi-canvas')
    gsap.registerPlugin(ScrollTrigger)
    const gsapTL = gsap.timeline()
    
    // needed for onUpdate function
    let needsUpdate = true;

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: viewerContainer as HTMLCanvasElement,
        useRgbm: true,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    
    // Camera Related
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add plugins individually.
    // await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(SSRPlugin)
    // await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    const importer = manager.importer as AssetImporter

    const setUpScrollAnimation = () => {
        document.body.style.overflowY = "scroll"

        const tl = gsap.timeline()

        // view-2
        tl.to(position, {x: -7.5, y: 2, z: 7.5, scrollTrigger: { trigger: ".view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate, onComplete(){}})
          .to(watch.rotation, {y: Math.PI / 2, scrollTrigger: { trigger: ".view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onComplete(){}})
          .to(target, {x: 0, y: .4, z: 2.9, scrollTrigger: { trigger: ".view-2",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate})
        
        // view-3
          .to(watch.rotation, {y: Math.PI * 1.5, scrollTrigger: { trigger: ".view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onComplete(){}})
          .to(target, {x: 0, y: -.51, z: -4, scrollTrigger: { trigger: ".view-3",  start: "top bottom", end: "top top", scrub: true, immediateRender: false }, onUpdate})
    }

    const reset = () => {
        gsapTL
            .to(position, {x: -7.5, y: 2, z: 7.5, duration: 4, onUpdate})
            .to(target, {x: 0, y: -.51, z: -4, duration: 2, onUpdate, onComplete: setUpScrollAnimation}, '-=2')
    }

    importer.addEventListener("onStart", (ev) => {
        onUpdate()
    })
    
    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        document.querySelector('.progress')?.setAttribute('style',`transform: scaleX(${progressRatio})`)
        
        if(progressRatio > .9){
            gsapTL
                .to(loader, {opacity:0, duration: 1, onUpdate, onComplete(){
                    loader.style.display = "none"
                }})
                .to(container, {opacity:1, duration: 2, onUpdate, onComplete(){
                    loader.style.display = "block"
                }})
        }
    })

    importer.addEventListener("onLoad", (ev) => {
        reset()
    })

    await manager.addFromPath("./assets/classic-watch.glb")
    const watch = viewer.scene.findObjectsByName('Scene')[0] as any as Mesh<BufferGeometry,MeshStandardMaterial2>

    const camViews = viewer.getPlugin(CameraViewPlugin)
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );
    
    // Camera Transform // x: 3, y: -0.8, z: 1.2
    viewer.scene.activeCamera.position = new THREE.Vector3(13, 0, 0);
    viewer.scene.activeCamera.target = new THREE.Vector3(0, 0, 0);
    
    // Camera Options
    const options = viewer.scene.activeCamera.getCameraOptions();
    // options.fov = 25;
    viewer.scene.activeCamera.setCameraOptions(options);

    // Control Options
    const controls = viewer.scene.activeCamera.controls!;
    // controls.autoRotate = true;
    controls.autoRotateSpeed = 0;
    controls.enableDamping = true;
    controls.rotateSpeed = 2.0;
    controls.enableZoom = false;
    controls.enabled = false;
    
    btn1?.addEventListener("click", function(e){
        // gsapTL
        //     .to(position, {x: 3, y: -0.8, z: 1.2}, {x: 1.28, y: -1.7, z: 5.86, duration: 4, onUpdate}, '-=0.8')
        //     .fromTo(target, {x: 2.5, y: -0.07, z: -0.1}, {x: 0.91, y: 0.03, z: -0.25, duration: 4, onUpdate}, '-=4')
        gsapTL
            .to(position, {x: 10, y: 10, z: 10, duration: 2, onUpdate})
            .to(target, {x: 0, y: 0, z:0, duration: 2, onUpdate}, '-=2')
    })

    btn2?.addEventListener("click", function(e){
        gsapTL
            .to(position, {x: 20, y: 20, z: 20, duration: 2, onUpdate})
            .to(target, {x: 0, y: 0, z:0, duration: 2, onUpdate}, '-=2')
    })

    btn3?.addEventListener("click", function(e){
        gsapTL
            .to(position, {x: 13, y: 0, z: 0, duration: 2, onUpdate})
            .to(target, {x: 0, y: 0, z:0, duration: 2, onUpdate}, '-=2')
    })
    
    btn4?.addEventListener("click", function(e){
        gsapTL
            .to(position, {x: 10, y: 2, z: -10, duration: 2, onUpdate})
            .to(target, {x: 0, y: 0, z:0, duration: 2, onUpdate}, '-=2')
    })
    
    function onUpdate(){
        needsUpdate = true;
    }
    
    viewer.addEventListener('preFrame', ()=>{
        if(needsUpdate){
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false;
        }
    })

    btnReset?.addEventListener('click', ()=>{
        reset()
    })

    viewer.renderer.refreshPipeline()

    // viewerContainer?.focus()

}

setupViewer()
