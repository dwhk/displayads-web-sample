
const inputContents = {
  uatSplash: [
    'https://abc/display/v2',
    '2',
    'frame1',
    '/123456/a.pc.web.uat/home/splash',
    '[1024,768]',
    '{"platform":"web","dtype":"pc","hdid":"123456","pos":1}',
    'https://abc-t'
  ],
  uatBanner: [
    'https://abc/display/v2',
    '1',
    'frame1',
    '/123456/a.pc.web.uat/home/bn',
    '[728, 90]',
    '{"platform":"web","dtype":"pc","hdid":"123456","pos":1}',
    'https://abc-t'
  ]
}

window.onload = async function () {
  adDisplay.init({
    endpoint: 'https://abc/display/v2',
  });
  const contents = inputContents.uatBanner;
  document.querySelectorAll('input').forEach((input, index) => {
    input.value = contents[index] || '';
  });
  // console.log('demo =====================');
  // bannerDemo();
  // splashDemo();
}


const onSelectAdType = (event) => {
  // console.log('event => ', event);
  // console.log('event => ', event.target);
  const dom = event.target;
  const name = dom.getAttribute('name')
  if (Object.keys(inputContents).includes(name)) {
    const contents = inputContents[name];
    document.querySelectorAll('input').forEach((input, index) => {
      input.value = contents[index] || '';
    });
  }
}

const onSubmit = async () => {
  const ipts = document.querySelectorAll('input');
  const form = {};
  ipts.forEach(input => {
    form[input.name] = input.value;
  });

  const { endpoint, af, id, iu, sz, cust_params, impression_host: impressionHost } = form;
  adDisplay.init({ endpoint, impressionHost });
  let size;
  try {
    size = JSON.parse(sz);
  } catch (_) {
    size = sz;
  }
  const slots = [
    { af, id, iu, sz: size },
  ];

  if (af == 1) {
    adDisplay.buildBanner(slots, cust_params, {
      onAdLoadFailed: (err) => alert('onAdLoadFailed => ' + err),
      onAdLoadFinished: (ad) => document.body.append(ad.adView),
      onAdRenderFinished: ad => { },
      onAdClosed: ad => { },
    });
  }
  else if (af == 2) {
    adDisplay.buildSplash(slots, cust_params, {
      onAdLoadFailed: (err) => {
        // handle ad load error
        if ([10602, 10609].includes(err.code)) {
          document.querySelector('#splash-ad').remove()
        }
        alert('onAdLoadFailed => ' + err);
      },
      onAdLoadFinished: (ad) => appendSplashDom(ad.adView),
      onAdRenderFinished: ad => { },
      onAdClosed: ad => {
        if (af == 2) document.querySelector('#splash-ad').remove()
      },
    });
  }

}

const appendSplashDom = dom => {
  const fixedContainer = document.createElement('div');
  fixedContainer.id = 'splash-ad';
  fixedContainer.style.position = 'fixed';
  fixedContainer.style.top =
    fixedContainer.style.bottom =
    fixedContainer.style.left =
    fixedContainer.style.right = 0;
  fixedContainer.style.display = 'flex';
  // fixedContainer.style.alignItems = fixedContainer.style.justifyContent = 'center';
  fixedContainer.style.background = 'rgba(0, 0, 0, .5)';
  fixedContainer.append(dom);
  document.body.append(fixedContainer);
}
