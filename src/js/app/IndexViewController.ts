/* eslint-disable no-unused-vars */
import ViewController from './tool/ViewController';
import PX from './tool/PX';
import Config from './Config';
import { delay, getImg, getRandom } from './tool/BaseTools';
import { util, push } from './tool/TD';
import EmitterSnow from '../../json/EmitterSnow.json';

export default class IndexViewController extends ViewController {
    isInit: boolean;
    isSecondLoadEnd: boolean;
    emitterCb: (dt: number) => void;
    mainWrap: PIXI.Container;

    private async init () {
        if (this.isInit) return;
        this.isInit = true;
        console.log('IndexViewController init');

        /* 延迟加载完成后 */
        this.instace.on('secondLoadEnd', () => {
            this.isSecondLoadEnd = true;
            $('.m-icon-loading').fadeOut(0);

            let demo3 = PX.addSprite(this.mainWrap, 'btn_share.png', 400, 400);
        });

        this.initScene();
        // await delay(0.1);
        // this.goMeshMixAnimation();
        console.log('Config.loaderRes :>> ', Config.loaderRes);
    }

    private async initScene () {
        this.mainWrap = PX.addCtn(PX.stage);

        // let sprite1 = new PIXI.Sprite(PIXI.utils.TextureCache['icon_lyf.png']);
        // sprite1.position.set(100, 100);
        // this.mainWrap.addChild(sprite1);
        // let sprite = new PIXI.Sprite(Cache[cacheName]);

        // let demo1 = PX.addSprite(this.mainWrap, 'icon_lyf.png', 100, 100, true);
        // let demo2 = PX.addSprite(this.mainWrap, 'icon_drj.png', 200, 100);

        // demo1.on('tap', (e: any) => {
        //     console.log(e);
        // });

        let testPool = {
            'Mesh动画压力测试': this.goMeshPressureTest,
            '遮罩测试': this.goMaskTest,
            '变换约束测试': this.goTnsTest,
            '路径约束和一键换肤测试': this.goPathCtrAndChangeSkinTest,
            'mesh动画贴图更换测试（翻页效果）': this.goPageDownTest,
            'mesh动画混合帧动画': this.goMeshMixAnimation,
            '粒子效果': this.initParticeles
        };

        for (const key in testPool) {
            if (Object.prototype.hasOwnProperty.call(testPool, key)) {
                // @ts-ignore
                const element = testPool[key];
                let div = $(`<div class="item">${key}</div>`);
                $('.m-select-wrap').append(div);
                div.on('click', () => {
                    this.mainWrap.removeChildren();
                    element.call(this);
                });
            }
        }
    }

    // Mesh动画压力测试
    goMeshPressureTest () {
        // console.log(process.env.PATH + 'img/spriteSheet/bg_juewei_251.json');
        var animation3 = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/bg_juewei_251.json'].spineData);
        animation3.position.set(getRandom(500, 1000), getRandom(500, 800));
        animation3.scale.set(0.4);
        this.mainWrap.addChild(animation3);
        animation3.state.setAnimation(0, 'start', true);

        let changeSkin = PX.addText(this.mainWrap, '增加动画', 1000, 600, 30, 'red', 'center', 400);
        changeSkin.interactive = true;
        changeSkin.once('tap', () => {
            changeSkin.destroy();
            this.goMeshPressureTest();
        });
        changeSkin.text += ': 总计' + (this.mainWrap.children.length - 1);
        // console.log(this.mainWrap.children.length);
    }

    // 遮罩测试
    goMaskTest () {
        var animation1 = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/mask-test.json'].spineData);
        this.mainWrap.addChild(animation1);
        animation1.position.set(415, 0);
        animation1.state.setAnimation(0, 'animation', true);
        // animation.scale.set(0.2);
    }

    // 变换约束测试
    goTnsTest () {
        var animation = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/tns-test.json'].spineData);
        this.mainWrap.addChild(animation);
        animation.position.set(400, 0);
        animation.state.setAnimation(0, 'animation', true);
    }

    // 路径约束和一键换肤测试
    goPathCtrAndChangeSkinTest () {
        var animation = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/pathCtrAndSkin.json'].spineData);
        this.mainWrap.addChild(animation);
        animation.position.set(400, 750);
        let skins = ['boy', 'girl'];
        let actions = ['down', 'hit'];
        animation.skeleton.setSkinByName(skins[0]);
        animation.state.setAnimation(0, actions[0], true);
        let changeSkin = PX.addText(this.mainWrap, '一键换装', 650, 600, 30, 'red', 'center', 400);
        changeSkin.interactive = true;
        changeSkin.on('tap', () => {
            skins.unshift(skins.pop());
            animation.skeleton.setSkinByName(skins[0]);
        });
        let changeAction = PX.addText(this.mainWrap, '切换动作', 850, 600, 30, 'red', 'center', 400);
        changeAction.interactive = true;
        changeAction.on('tap', () => {
            actions.unshift(actions.pop());
            animation.state.setAnimation(0, actions[0], true);
        });
    }

    // mesh动画贴图更换测试（翻页效果）
    goPageDownTest () {
        var animation2 = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/meshSpriteReplace.json'].spineData);
        animation2.position.set(600, 375);
        animation2.scale.set(0.6);
        this.mainWrap.addChild(animation2);
        animation2.name = 'book';
        animation2.state.setAnimation(0, 'animation', !true);

        let skins = ['icon_lyf.png', 'skeleton-2.jpg'];
        let changeSkin = PX.addText(this.mainWrap, '贴图更换', 800, 600, 30, 'red', 'center', 400);
        changeSkin.interactive = true;
        changeSkin.on('tap', async () => {
            let img = await getImg(require('../../img/autoLoad/' + skins[0]), true);
            // @ts-ignore
            animation2.getChildAt(0).children[0].texture = PIXI.Texture.from(img);
            animation2.state.setAnimation(0, 'animation', !true);
            skins.unshift(skins.pop());
        });
    }

    // mesh动画混合帧动画
    private goMeshMixAnimation () {
        var meshAnim = new PIXI.spine.Spine(Config.loaderRes[Config.imgPath + 'spriteSheet/1.json'].spineData);
        meshAnim.position.set(650, -650);
        this.mainWrap.addChild(meshAnim);
        meshAnim.state.setAnimation(0, 'test1', true);

        let sprite = new PIXI.Sprite();
        // @ts-ignore
        sprite.texture = new PIXI.Texture(meshAnim.getChildAt(0).children[0].texture.baseTexture);

        let ani = PX.addAnimation(this.mainWrap, 'ani_', '.png', 24, 1000, 20, 0.2, true, true);
        ani.scale.set(0.8);
        let lastTexture: any;
        ani.onFrameChange = () => {
            // @ts-ignore
            lastTexture && meshAnim.getChildAt(0).children[0].texture.baseTexture.destroy(true);
            // @ts-ignore
            lastTexture = PX.app.renderer.generateTexture(sprite);
            // @ts-ignore
            meshAnim.getChildAt(0).children[0].texture = lastTexture;
        };

        let mix = PX.addText(this.mainWrap, '合并', 900, 600, 30, 'red', 'center', 400);
        mix.interactive = true;
        mix.on('tap', async () => {
            ani.position.set(0, 660);
            ani.setParent(sprite);
        });
    }

    // 粒子效果
    private initParticeles () {
        if (Config.notLoadMoreAnim) return;
        let pWrap = PX.addCtn(this.mainWrap);
        let emitterSnow = new window.Particles.Emitter(pWrap, [PIXI.Sprite.from('particle.png').texture], EmitterSnow);
        emitterSnow.emit = true;

        this.emitterCb = (dt: number) => {
            emitterSnow.update(dt * 0.016);
        };
        // @ts-ignore
        this.emitterCb && PX.app.ticker.add(this.emitterCb);
    }

    // 检测所有资源加载完
    private checkoutLoadEnd () {
        if (this.isSecondLoadEnd) {
            return true;
        } else {
            $('.m-icon-loading').fadeIn(100);
            return false;
        }
    }

    public show (debug: boolean) {
        this.init();
    }

    public hide () {
    }
}
