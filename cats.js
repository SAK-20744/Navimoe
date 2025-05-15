const formatNumber = (n) => n.toString().replace(/(\d)(?=(?:\d{3})+(?:$|\.))/g, '$1,');

const formatCategory = (category) => category.replace(/^group_(.)/, function(match) {
  return match.slice(-1).toUpperCase();
});

const formatRarity = (rarity) => rarity.replace(/^.*(\d).*$/, 'R$1');

const formatSponsor = (sponsor) => {
  if (sponsor == G_SP_NONE) {
    return 'None';
  } else if (sponsor == G_SP_MECHA) {
    return 'Mecha Corp';
  } else if (sponsor == G_SP_NATURALIS) {
    return 'Naturalis Inc';
  } else if (sponsor == G_SP_GLUTTONY) {
    return 'Gluttony Ltd';
  } else if (sponsor == G_SP_SPORTY) {
    return 'Sporty LLC';
  }
};

const formatPower = (power) => {
  if (power > 0) {
    return '+' + power;
  }
  return power;
};

const formatBonus = (bonus) => {
  if (!bonus) {
    return '';
  }
  return formatCategory(bonus.c) + ' +' + bonus.p + '%';
};

const formatClass = (cl) => {
  if (cl == G_CL_MELEE) {
    return 'Melee';
  } else if (cl == G_CL_RANGED) {
    return 'Ranged';
  } else if (cl == G_CL_AUTO_AIM) {
    return 'Auto-aim';
  } else if (cl == G_CL_MINION) {
    return 'Minion';
  } else if (cl == G_CL_SPECIAL) {
    return 'Special';
  } else if (cl == G_CL_NONE) {
    return 'None';
  }
  return '';
};

const categoryIndex = (category) => {
  return category == G_BODY ? 0 : category == G_WEAPON ? 1 : category == G_WHEEL ? 2 : 3;
};

const sponsorImage = (sponsor) => {
  return createItem({s: sponsor}).sponsorImage();
};

function TableBuilder(table) {
  let t = table;

  this.appendRow = (cells) => {
    const row = t.insertRow();
    for (const cell of cells) {
      this.appendCell(row, cell);
    }
    return row;
  };

  this.appendCell = (row, cell) => {
    const td = row.insertCell();
    if (typeof cell != 'object') {
      td.innerHTML = cell;
      return;
    }
    if (cell.th) {
      td.outerHTML = '<th>' + cell.s + '</td>';
    } else if (cell.s) {
      td.innerHTML = cell.s;
    } else {
      td.outerHTML = cell.os;
    }
    if (cell.class) {
        td.setAttribute('class', cell.class);
    }
    if (cell.cs) {
        td.setAttribute('colspan', cell.cs);
    }
    if (cell.rs) {
        td.setAttribute('rowspan', cell.rs);
    }
    if (cell.align) {
        td.setAttribute('style', `text-align: ${cell.align}`);
    }
    if (cell.style) {
        td.setAttribute('style', cell.style);
    }
    return td;
  };

  this.clear = () => {
    while (t.rows.length > 0) {
      t.deleteRow(-1);
    }
  };
}

function LineupItem(item) {
  let selected = false;

  this.item = () => item;
  this.selected = () => selected;
  this.setSelected = (value) => { selected = value };
}

function CarBuilderItem(item, level) {
  level = level || item.maxLevel();

  this.item = () => item;
  this.level = () => level;
  this.setLevel = (value) => { level = value };
  this.clone = () => new CarBuilderItem(item, level);
  this.hp = () => item.hp(this.level());
  this.atk = () => item.atk(this.level());
  this.mHp = () => item.mHp(this.level());
}

function CarBuilder() {
  this.items = () => items;

  this.add = (carBuilderItem) => {
    items.push(carBuilderItem);
    items.sort((a, b) => {
      a = a.item();
      b = b.item();
      if (a.category() != b.category()) {
        return categoryIndex(a.category()) - categoryIndex(b.category());
      }
      if (a.rarity() != b.rarity()) {
        return a.rarity() - b.rarity();
      }
      return a.name() > b.name() ? 1 : -1;
    });
  };

  this.remove = (carBuilderItem) => {
    items = items.filter((elem) => elem.item().name() != carBuilderItem.item().name());
  };

  this.updateLevel = (name, level) => {
    for (const elem of items) {
      if (elem.item().name() == name) {
        elem.setLevel(level);
      }
    }
  };

  this.capAllLevels = () => {
    for (const elem of items) {
      if (elem.level() > elem.item().maxLevel()) {
        elem.setLevel(elem.item().maxLevel());
      }
    }
  };

  this.validate = () => {
    const numBodies = items.filter((elem, index, arr) => elem.item().category() == G_BODY).length;
    const numWeapons = items.filter((elem, index, arr) => elem.item().category() == G_WEAPON).length;
    const numWheels = items.filter((elem, index, arr) => elem.item().category() == G_WHEEL).length;
    const numGadgets = items.filter((elem, index, arr) => elem.item().category() == G_GADGET).length;

    const body = numBodies == 0 ? null : items.filter((elem, index, arr) => elem.item().category() == G_BODY)[0];
    const numBodySlots = 1;
    const numWeaponSlots = body === null ? 0 : body.item().slots().weapon;
    const numWheelSlots = body === null ? 0 : body.item().slots().wheel;
    const numGadgetSlots = body === null ? 0 : body.item().slots().gadget;

    const bodyHp = items.reduce((out, elem) => elem.item().category() == G_BODY ? out + elem.hp() : out, 0);
    const wheelHp = items.reduce((out, elem) => elem.item().category() == G_WHEEL ? out + elem.hp() : out, 0);
    const gadgetHp = items.reduce((out, elem) => elem.item().category() == G_GADGET ? out + elem.hp() : out, 0);

    const weaponAtk = items.reduce((out, elem) => elem.item().category() == G_WEAPON ? out + elem.atk() : out, 0);
    const wheelAtk = items.reduce((out, elem) => elem.item().category() == G_WHEEL ? out + elem.atk() : out, 0);

    const powerSupply = items.reduce((out, elem) => elem.item().power() > 0 ? out + elem.item().power() : out, 0);
    const powerConsumption = items.reduce((out, elem) => elem.item().power() < 0 ? out - elem.item().power() : out, 0);

    const bodyBonusPct =
        items.reduce((out, elem) => elem.item().bonus() != null && elem.item().bonus().c == G_BODY ? out + elem.item().bonus().p : out, 0);
    const weaponBonusPct =
        items.reduce((out, elem) => elem.item().bonus() != null && elem.item().bonus().c == G_WEAPON ? out + elem.item().bonus().p : out, 0);
    const wheelBonusPct =
        items.reduce((out, elem) => elem.item().bonus() != null && elem.item().bonus().c == G_WHEEL ? out + elem.item().bonus().p : out, 0);
    const gadgetBonusPct =
        items.reduce((out, elem) => elem.item().bonus() != null && elem.item().bonus().c == G_GADGET ? out + elem.item().bonus().p : out, 0);

    const sponsorCounts = {};
    const computeSponsorCounts = (sponsor) => {
      return items.reduce((out, elem) => elem.item().sponsor() == sponsor ? out + 1 : out, 0)
    };
    sponsorCounts[G_SP_MECHA] = computeSponsorCounts(G_SP_MECHA);
    sponsorCounts[G_SP_NATURALIS] = computeSponsorCounts(G_SP_NATURALIS);
    sponsorCounts[G_SP_GLUTTONY] = computeSponsorCounts(G_SP_GLUTTONY);
    sponsorCounts[G_SP_SPORTY] = computeSponsorCounts(G_SP_SPORTY);
    const sponsorBonusPct = Object.keys(sponsorCounts).map((k) => sponsorCounts[k]).reduce((out, elem) => out + (elem >= 3 ? (elem - 3) * 5 + 10 : 0), 0);

    let hp = bodyHp * (1 + bodyBonusPct / 100) + wheelHp * (1 + wheelBonusPct / 100) + gadgetHp * (1 + gadgetBonusPct / 100);
    let atk = weaponAtk * (1 + weaponBonusPct / 100) + wheelAtk * (1 + wheelBonusPct / 100);
    hp *= 1 + sponsorBonusPct / 100;
    atk *= 1 + sponsorBonusPct / 100;

    // Hover message.
    const hoverMessages = {};
    items.map((elem) => {
      let hp = elem.hp();
      let atk = elem.atk();
      const mHp = elem.mHp();
      const messages = [];

      let bonusPct = elem.item().category() == G_BODY
          ? bodyBonusPct
          : elem.item().category() == G_WHEEL
              ? wheelBonusPct
              : elem.item().category() == G_GADGET
                  ? gadgetBonusPct
                  : 1;
      hp = hp * (1 + bonusPct / 100) * (1 + sponsorBonusPct / 100);
      messages.push('HP: ' + Math.floor(hp));

      bonusPct = elem.item().category() == G_WEAPON ? weaponBonusPct : elem.item().category() == G_WHEEL ? wheelBonusPct : 1;
      atk = atk * (1 + bonusPct / 100) * (1 + sponsorBonusPct / 100);
      messages.push('ATK: ' + Math.floor(atk));

      if (mHp > 0) {
        messages.push('Minion HP: ' + Math.floor(mHp));
      }
      hoverMessages[elem.item().name()] = messages.join('\n');
    });

    const error = (() => {
      if (numBodies == 0) {
        return 'Body is missing';
      }
      if (numBodies > 1) {
        return 'Too many bodies';
      }
      const body = items.filter((elem, index, arr) => elem.item().category() == G_BODY)[0];
      if (numWeapons > numWeaponSlots) {
        return 'Too many weapons';
      }
      if (numWheels > numWheelSlots) {
        return 'Too many wheels';
      }
      if (numGadgets > numGadgetSlots) {
        return 'Too many gadgets';
      }
      if (powerSupply < powerConsumption) {
        return 'Not enough power';
      }
      return '';
    })();
    const ok = error == '';

    return {
      ok: ok,
      error: error,
      hp: hp,
      atk: atk,
      powerSupply: powerSupply,
      powerConsumption: powerConsumption,
      sponsorBonusPct: sponsorBonusPct,
      sponsorCounts: sponsorCounts,

      numBodies: numBodies,
      numWeapons: numWeapons,
      numWheels: numWheels,
      numGadgets: numGadgets,

      numBodySlots: numBodySlots,
      numWeaponSlots: numWeaponSlots,
      numWheelSlots: numWheelSlots,
      numGadgetSlots: numGadgetSlots,

      bodyBonusPct: bodyBonusPct,
      weaponBonusPct: weaponBonusPct,
      wheelBonusPct, wheelBonusPct,
      gadgetBonusPct: gadgetBonusPct,

      hoverMessages: hoverMessages,

      // Below are debug information.
      bodyHp: bodyHp,
      wheelHp: wheelHp,
      gadgetHp: gadgetHp,

      weaponAtk: weaponAtk,
      wheelAtk: wheelAtk,
    };
  };

  let items = [];
}

const runCatsBuddy = () => {
  const renderer = (() => {
    const $d = document;
    const $w = window;
    const $ls = localStorage;
    const $l = $d.location.href;
    const $lf = ($l.match(/&filter=.*/) || [''])[0];
    const $i = (id, node) => (node || $d).getElementById(id);
    const $q = (selector, node) => (node || $d).querySelector(selector);
    const $qa = (selector, node) => (node || $d).querySelectorAll(selector);

    window.$i = $i;
    window.$q = $q;
    window.$qa = $qa;
    const $c = (tag, parent, attributes, asFirstChild) => {
        let node = $d.createElement(tag);
        if (attributes) {
            if (attributes.id) { node.id = attributes.id; }
            if (attributes.name) { node.name = attributes.name; }
            if (attributes.style) { node.style.cssText = attributes.style; }
            if (attributes.class) { node.className = attributes.class; }
            if (attributes.value) { node.value = attributes.value; }
            if (attributes.html) { node.innerHTML = attributes.html; }
            if (attributes.type) { node.type = attributes.type; }
            if (attributes.src) { node.src = attributes.src; }
            if (attributes.href) { node.href = attributes.href; }
        }
        if (parent) {
          if (asFirstChild) {
            parent.insertBefore(node, parent.firstChild);
          } else {
            parent.append(node);
          }
        }
        return node;
    };

    const levelMapper = () => $i('level-mapper');
    const costEstimator = () => $i('cost-estimator');
    const lineup = () => $i('lineup');
    const lineupTable = () => $i('lineup-table');
    const lmMapBtn = () => $i('lm-map-btn');
    const lmClearBtn = () => $i('lm-clear-btn');

    const carBuilderRenderer = (() => {
      const setUp = () => {};

      // Adds a car and sets it as the current car to build.
      const addCar = () => {
        carDiv = $c('div', $i('cars'), {class: 'car'}, /*asFirstChild=*/true);
        carDiv.innerHTML = `
          <div class="car-parts"></div>
          <div class="car-info-container">
            <div class="car-info"></div>
            <div class="car-ops">
              <button class="car-remove-btn">Remove</button>
              <button class="car-clone-btn">Clone</button>
            </div>
          </div>
        `;
        carPartsDiv = $q('div.car-parts', carDiv);
        carInfoDiv = $q('div.car-info', carDiv);
        carRemoveBtn = $q('button.car-remove-btn', carDiv);
        carCloneBtn = $q('button.car-clone-btn', carDiv);
      };

      const removeCar = (carDiv) => {
        logger.log(carDiv);
        $i('cars').removeChild(carDiv);
      };

      const freezeCar = (carDiv) => {
        $qa('div.car-parts select', carDiv).forEach((select) => {
          select.disabled = true;
        });
      };

      const showItems = (carBuilderItems, validationInfo, updateLevelCb) => {
        carPartsDiv.innerHTML = '';
        for (const carBuilderItem of carBuilderItems) {
          const div = $c('div', carPartsDiv, {class: 'item-img-container'});
          $c('img', div, {class: 'item-img'}).src = carBuilderItem.item().image();
          const select = $c('select', div, {class: 'item-level'});
          for (let i = carBuilderItem.item().maxLevel(); i > 0; --i) {
            const option = $c('option', select, {value: i});
            option.innerHTML = i;
            if (i == carBuilderItem.level()) {
              option.selected = true;
            }
          }
          select.addEventListener('change', (() => {
            const name = carBuilderItem.item().name();
            return (e) => updateLevelCb(name, e.target.value);
          })());
          div.title = validationInfo.hoverMessages[carBuilderItem.item().name()];
        }
      };

      const currentTotalWithColor = (current, total) => {
        const style = current < total ? 'color-less' : current == total ? 'color-matched' : 'color-over'
        return '<span class="' + style + '">' + current + '/' + total + '</span>';
      }

      const showInfo = (info) => {
        const rows = [];
        rows.push('Status: ' + (info.ok ? 'OK' : info.error));
        rows.push('HP: ' + info.hp.toFixed(0));
        rows.push('ATK: ' + info.atk.toFixed(0));
        rows.push('Power: ' + currentTotalWithColor(info.powerConsumption, info.powerSupply));
        rows.push('Slots: ' + currentTotalWithColor(info.numBodies, info.numBodySlots) + ' bodies, ' +
                  currentTotalWithColor(info.numWeapons, info.numWeaponSlots) + ' weapons, ' +
                  currentTotalWithColor(info.numWheels, info.numWheelSlots) + ' wheels, ' +
                  currentTotalWithColor(info.numGadgets, info.numGadgetSlots) + ' gadgets'
        );
        rows.push('Bonus: ' + info.bodyBonusPct + '% body, ' + info.weaponBonusPct + '% weapon, ' +
                  info.wheelBonusPct + '% wheels, ' + info.gadgetBonusPct + '% gadgets');
        let row = 'Sponsor: +' + info.sponsorBonusPct + '% ';
        for (const sponsor of [G_SP_MECHA, G_SP_NATURALIS, G_SP_GLUTTONY, G_SP_SPORTY]) {
          for (let i = 0; i < info.sponsorCounts[sponsor]; ++i) {
            row += '<img src="' + sponsorImage(sponsor) + '" class="sponsor-img" />'
          }
        }
        rows.push(row);
        const s = rows.join('<br>');
        carInfoDiv.innerHTML = s;
      };

      const getBuildNewCarBtn = () => $i('build-new-car');
      const getCarDiv = () => carDiv;
      const getCarRemoveBtn = () => carRemoveBtn;
      const getCarCloneBtn = () => carCloneBtn;

      let carDiv;
      let carPartsDiv;
      let carInfoDiv;
      let carRemoveBtn;
      let carCloneBtn;
      return {setUp, addCar, removeCar, freezeCar, showItems, showInfo, getBuildNewCarBtn, getCarDiv, getCarRemoveBtn, getCarCloneBtn};
    })();

    const levelMapperRenderer = (() => {
      const showLevelMapperResults = (results) => {
        const resDiv = $q('.lm-results', levelMapper());
        const table = $c('table', resDiv, {class: 'lm-result'}, /*asFirstChild=*/true);
        const tableBuilder = new TableBuilder(table);
        tableBuilder.appendRow([{s: 'Level', th: true}, {s: 'Stats', th: true}, {s: 'Increment', th: true}, {s: 'Piece', th: true}, {s: 'Cash', th: true}, {s: 'Token', th: true}, {s: 'Inc./kCash', th: true}, {s: 'Inc./Token', th: true}]);
        for (const r of results) {
          tableBuilder.appendRow([r.level, r.stats, r.increment, r.piece, r.cash, r.token, r.incPerKCash, r.incPerToken]);
        }
      };

      const clear = () => {
        const resDiv = $q('.lm-results', levelMapper());
        resDiv.innerHTML = '';
      };

      const setUp = () => {};

      return {setUp, showLevelMapperResults, clear};
    })();

    const settingsRenderer = (() => {
      const setUp = () => {
        optionsDiv = $i('options');
        showOptions();
      };

      const showOptions = () => {
        showSelectOption('levelCap', 'Level cap',
                         [{v: F_LEVEL_CAP_18_20, t: 'R6: 18, R1-5: 20', s: true}, {v: F_LEVEL_CAP_15_18, t: 'R6: 15, R1-5: 18'}]);
      };

      const showSelectOption = (name, description, options) => {
        const p = $c('p', optionsDiv);
        p.innerHTML = description + ': ';
        const select = $c('select', p);
        for (const o of options) {
          const option = $c('option', select, {value: o.v});
          option.innerHTML = o.t;
          if (o.hasOwnProperty('s')) {
            option.selected = true;
          }
        }
        select.addEventListener('change', (() => {
          const nameLocal = name;
          return (e) => updateCb(nameLocal, e.target.value);
        })());
      };

      const setUpdateCb = (cb) => {
        updateCb = cb;
      };

      // The callback to update when an option is updated.
      let updateCb;
      let optionsDiv;

      return {setUp, setUpdateCb};
    })();

    const lineupRenderer = (() => {
      const setUp = () => {
        addHeader();
      };

      const addHeader = () => {
        tableBuilder.appendRow([
            {s: 'Image', th: true},
            {s: 'Name', th: true},
            {s: 'Category', th: true},
            {s: 'R/S', th: true},
            {s: 'HP Max/Min<br>(Minion HP Max/Min)', th: true},
            {s: 'ATK (Max/Min)', th: true},
            {s: 'Slot', th: true},
            {s: 'Power', th: true},
            {s: 'Bonus', th: true},
        ]);
      };

      const formatSlots = (slots) => {
        if (!slots) {
          return '';
        }
        return 'Weapon: ' + slots.weapon + '<br>Wheel: ' + slots.wheel + '<br>Gadget: ' + slots.gadget;
      };

      const addItem = (lineupItem) => {
        const item = lineupItem.item();
        const image = item.image() ? '<img src="' + item.image() + '" class="item-img" />' : '';
        const name = item.nameEn() + '<br>' + item.nameZh() + '<br>' + item.nameJa();
        let category = formatCategory(item.category());
        if (item.class() != G_CL_NONE) {
          category += '<br>(' + formatClass(item.class()) + ')';
        }
        const rs = '<img src="' + item.rarityImage() + '" class="rarity-img" />' + '<img src="' + item.sponsorImage() + '" class="sponsor-img" />';
        let hp = formatNumber(item.hpMax()) + ' / ' + formatNumber(item.hp1());
        if (item.mHp1() != 0) {
          hp += '<br>(' + formatNumber(item.mHpMax()) + ' / ' + formatNumber(item.mHp1()) + ')';
        }
        const atk = formatNumber(item.atkMax()) + ' / ' + formatNumber(item.atk1());
        const slot = formatSlots(item.slots());
        const power = formatPower(item.power());
        const bonus = formatBonus(item.bonus());
        return tableBuilder.appendRow([
            image, name, category, rs,
            {s: hp, class: 'align-right'},
            {s: atk, class: 'align-right'},
            slot, power, bonus,
        ]);
      };

      const addItems = (lineupItems) => {
        tableBuilder.clear();
        addHeader();
        const rows = [];
        for (const lineupItem of lineupItems) {
          const row = addItem(lineupItem);
          if (lineupItem.selected()) {
            row.className = 'selected';
          }
          rows.push(row);
        }
        return rows;
      };

      const clearAllSelected = () => {
        $qa('tr', lineupTable()).forEach((tr) => {
          tr.className = tr.className.replace(/\bselected\b/, '').replace(/ +/g, ' ');
        });
      };

      const lineupTable = () => $q('#lineup-table');

      const tableBuilder = new TableBuilder(lineupTable());
      return {setUp, addItem, addItems, clearAllSelected};
    })();

    const setUp = () => {
      levelMapperRenderer.setUp();
      carBuilderRenderer.setUp();
      settingsRenderer.setUp();
      lineupRenderer.setUp();
    };

    setUp();
    return {
        // DOM elements
        lmMapBtn, lmClearBtn, lineupTable,
        // Methods
        levelMapperRenderer, lineupRenderer, settingsRenderer, carBuilderRenderer};
  })();

  const controller = (() => {
    const carBuilderController = (() => {
      const setUp = () => {
        buildNewCar();
        renderer.carBuilderRenderer.getBuildNewCarBtn().addEventListener(
            'click',
            () => buildNewCar());
      };

      const updateLevelCb = (name, level) => {
        builder.updateLevel(name, level);
        update();
      };

      const update = () => {
        builder.capAllLevels();
        const info = builder.validate();
        renderer.carBuilderRenderer.showItems(builder.items(), info, updateLevelCb);
        logger.log('Car Builder validation:', info);
        renderer.carBuilderRenderer.showInfo(info);
      };

      const buildNewCar = (fromBuilder) => {
        builder = new CarBuilder;
        renderer.carBuilderRenderer.freezeCar(renderer.carBuilderRenderer.getCarDiv());
        renderer.carBuilderRenderer.addCar();
        lineupController.extraData.clearAllSelected();
        renderer.lineupRenderer.clearAllSelected();
        if (fromBuilder) {
          for (const carBuilderItem of fromBuilder.items()) {
            builder.add(carBuilderItem.clone());
            lineupController.extraData.getItem(carBuilderItem.item().name()).setSelected(true);
          }
          lineupController.showLineup();
        }
        update();
        renderer.carBuilderRenderer.getCarRemoveBtn().addEventListener(
            'click',
            (() => {
              const carDiv = renderer.carBuilderRenderer.getCarDiv();
              return () => renderer.carBuilderRenderer.removeCar(carDiv);
            })()
        );
        renderer.carBuilderRenderer.getCarCloneBtn().addEventListener(
            'click',
            (() => {
              const builderLocal = builder;
              return () => cloneCar(builderLocal);
            })()
        );
      };

      const cloneCar = (builder) => {
        buildNewCar(builder);
      }

      const add = (carBuilderItem) => {
        builder.add(carBuilderItem);
        update();
      };

      const remove = (carBuilderItem) => {
        builder.remove(carBuilderItem);
        update();
      };

      const rerender = () => { update(); };

      let builder = new CarBuilder;
      return {setUp, add, remove, rerender};
    })();

    const mapLevelController = (() => {
      const mapLevel = () => {
        const level = parseInt($i('lm-level').value);
        const baseStats = parseInt($i('lm-base-stats').value);
        // Stats increment pattern.
        const sip = $i('lm-sip').value;
        const rarity = sipToRarity(sip);
        logger.log('Map level', level, baseStats, sip, rarity);

        for (let i = 0; i <= 100000; ++i) {
          const stats = mapToLevelBySip(i, level, sip);
          if (stats >=baseStats - 0.1) {
            numLevel1 = i;
            break;
          }
        }

        const fakeItem = createItem({r: rarity, sip: sip, hp1: numLevel1});
        const results = [{level: 0, stats: 0, rawNumber: 0}];
        const costs = estimateCosts(level, fakeItem.rarity());
        for (let i = 1; i <= fakeItem.maxLevel(); ++i) {
          const value = mapToLevelBySip(numLevel1, i, fakeItem.sip());
          const incValue = value - results[i - 1].rawNumber;

          const stats = formatNumber(value);
          const increment = (() => {
            if (i == 1) {
              return '';
            }
            const prevValue = results[i - 1].rawNumber;
            let result = incValue.toString();
            if (prevValue > 0) {
              const percent = incValue / prevValue * 100;
              result += ' (+' + percent.toFixed(2) + '%)';
            }
            return result;
          })();
          const piece = (() => {
            return costs[i].p.toString() + (i == 1 ? '' : ' (+' + (costs[i].p - costs[i - 1].p) + ')');
          })();
          const cash = (() => {
            return formatNumber(costs[i].c) + (i == 1 ? '' : ' (+' + formatNumber(costs[i].c - costs[i - 1].c) + ')');
          })();
          const token = (() => {
            return costs[i].t.toString() + (i == 1 ? '' : ' (+' + (costs[i].t - costs[i - 1].t) + ')');
          })();
          const incPerKCash = (() => {
            const incCash = costs[i].c - costs[i - 1].c;
            return incCash == 0 ? 'N/A' : (incValue / incCash * 1000).toFixed(2);
          })();
          const incPerToken = (() => {
            const incToken = costs[i].t - costs[i - 1].t;
            return incToken == 0 ? 'N/A' : (incValue / incToken).toFixed(2);
          })();
          results.push({level: i, rawNumber: value, stats: stats, increment: increment, piece: piece, cash: cash, token: token,
                        incPerKCash: incPerKCash, incPerToken: incPerToken});
        }
        renderer.levelMapperRenderer.showLevelMapperResults(results.slice(1));
      };

      const clear = () => {
        renderer.levelMapperRenderer.clear();
      };

      const setUp = () => {
        renderer.lmMapBtn().addEventListener('click', mapLevel);
        renderer.lmClearBtn().addEventListener('click', clear);
      };

      return {setUp};
    })();

    const settingsController = (() => {
      const setUp = () => {
        renderer.settingsRenderer.setUpdateCb(setOption);
      };

      const setOption = (name, value) => {
        if (!features.hasOwnProperty(name)) {
          logger.error('Failed to set option "' + name + '": option not found.');
          return;
        }
        // TODO: Register handlers instead of if-else.
        if (name = 'levelCap') {
          if (!newLevelCapValidator(value)) {
            logger.error('Invalid value for option "' + name + '": ' + value);
            return;
          }
          features[name] = value;
          newLevelCapCb();
        }
      };

      const newLevelCapValidator = (value) => {
        return value == F_LEVEL_CAP_18_20 || value == F_LEVEL_CAP_15_18;
      };

      const newLevelCapCb = () => {
        lineupController.showLineup();
        carBuilderController.rerender();
      };

      return {setUp, setOption};
    })();
    window.settingsController = settingsController;

    const lineupController = (() => {
      const extraData = (() => {
        const setUp = () => {
          for (const itemName of allItemNames) {
            items[itemName] = new LineupItem(itemPool[itemName]);
          }
        };

        const getItem = (itemName) => {
          return items[itemName];
        };

        const clearAllSelected = () => {
          for (const itemName in items) {
            items[itemName].setSelected(false);
          }
        };

        const items = {};
        return {setUp, getItem, clearAllSelected};
      })();

      const setUpForSingleSelect = (tdSelector) => {
        const changeView = (() => {
          const tdSelectorLocal = tdSelector;
          return (e) => {
            $qa(tdSelectorLocal).forEach((td) => {
              td.className = td.className.replace(/selected/, '');
            });
            if (!e.target.className.match(/\bselected\b/)) {
              if (e.target.className != '') {
                e.target.className += ' ';
              }
              e.target.className += 'selected';
            }
            showLineup();
          };
        })();

        $qa(tdSelector).forEach((td) => {
          td.addEventListener('click', changeView);
        });
      };

      const setUpFilterView = () => { setUpForSingleSelect('#filter-view td'); };
      const setUpFilterSponsor = () => { setUpForSingleSelect('#filter-sponsor td'); };
      const setUpFilterRarity = () => { setUpForSingleSelect('#filter-rarity td'); };
      const setUpFilterPower = () => { setUpForSingleSelect('#filter-power td'); };
      const setUpFilterClass = () => { setUpForSingleSelect('#filter-class td'); };
      const setUpFilterSortBy = () => { setUpForSingleSelect('#filter-sort-by td') };

      const setUp = () => {
        extraData.setUp();
        setUpFilterView();
        setUpFilterSponsor();
        setUpFilterRarity();
        setUpFilterPower();
        setUpFilterClass();
        setUpFilterSortBy();
        showLineup();
      };

      const shouldShowItem = (item) => {
        let td = $q('#filter-view td.selected');
        let matched = true;
        if (matched && td) {
          matched = (() => {
            if (td.innerText == 'All') {
              return true;
            } else if (td.innerText == 'All HP') {
              return item.hp1() > 0 || item.name() == CLOUD;
            } else if (td.innerText == 'All ATK') {
              return item.atk1() > 0;
            } else if (td.innerText == 'Bodies') {
              return item.category() == G_BODY;
            } else if (td.innerText == 'Weapons') {
              return item.category() == G_WEAPON;
            } else if (td.innerText == 'Wheels') {
              return item.category() == G_WHEEL;
            } else if (td.innerText == 'Gadgets') {
              return item.category() == G_GADGET;
            }
          })();
        }
        td = $q('#filter-sponsor td.selected');
        if (matched && td) {
          matched = (() => {
            if (td.innerText == 'All') {
              return true;
            } else {
              return td.getAttribute('value') == item.sponsor();
            }
          })();
        }
        td = $q('#filter-rarity td.selected');
        if (matched && td) {
          matched = (() => {
            if (td.innerText == 'All') {
              return true;
            } else {
              return td.getAttribute('value') == item.rarity();
            }
          })();
        }
        td = $q('#filter-power td.selected');
        if (matched && td) {
          matched = (() => {
            if (td.innerText == 'All') {
              return true;
            } else {
              return parseInt(td.getAttribute('value')) == item.power();
            }
          })();
        }
        td = $q('#filter-class td.selected');
        if (matched && td) {
          matched = (() => {
            if (td.innerText == 'All') {
              return true;
            } else {
              return td.getAttribute('value') == item.class();
            }
          })();
        }
        return matched;
      };

      const sortItems = (items) => {
        const td = $q('#filter-sort-by td.selected');
        if (!td) {
          return;
        }
        items.sort((a, b) => {
          const dimensions = [];
          if (td.innerText == 'HP') {
            dimensions.push(b.item().hpMax() - a.item().hpMax());
            dimensions.push(b.item().atkMax() - a.item().atkMax());
          } else if (td.innerText == 'ATK') {
            dimensions.push(b.item().atkMax() - a.item().atkMax());
            dimensions.push(b.item().hpMax() - a.item().hpMax());
          }
          dimensions.push(0);
          dimensions.push(0);
          return dimensions[0] || dimensions[1];
        });
      };

      const showLineup = () => {
        const lineupItems = [];
        for (const itemName of allItemNames) {
          const lineupItem = extraData.getItem(itemName);
          if (shouldShowItem(lineupItem.item())) {
            lineupItems.push(lineupItem);
          }
        }
        sortItems(lineupItems);
        const rows = renderer.lineupRenderer.addItems(lineupItems);
        for (let i = 0; i < rows.length && i < lineupItems.length; ++i) {
          rows[i].addEventListener('click', (() => {
            const lineupItem = lineupItems[i];
            const item = lineupItems[i].item();
            const row = rows[i];
            return () => {
              if (lineupItem.selected()) {
                row.className = row.className.replace(/\bselected\b/, '').replace(/ +/g, ' ');
                carBuilderController.remove(new CarBuilderItem(item));
              } else {
                row.className = row.className + (row.className == '' ? '' : ' ') + 'selected';
                carBuilderController.add(new CarBuilderItem(item));
              }
              lineupItem.setSelected(!lineupItem.selected());
            };
          })());
          $q('td', rows[i]).addEventListener('click', (() => {
            const item = lineupItems[i].item();
            return () => {
              $i('lm-level').value = 1;
              $i('lm-base-stats').value = item.hp1() || item.atk1();
              $i('lm-sip').value = item.sip();
              renderer.lmMapBtn().click();
            };
          })());
        }
      };

      return {setUp, extraData, showLineup};
    })();

    const setUp = () => {
      carBuilderController.setUp();
      mapLevelController.setUp();
      settingsController.setUp();
      lineupController.setUp();
    };

    setUp();
    return {};
  })();
};

$(() => {
  runCatsBuddy();
});
