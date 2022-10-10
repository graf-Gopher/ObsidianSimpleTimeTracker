/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => SimpleTimeTrackerPlugin
});
var import_obsidian3 = __toModule(require("obsidian"));

// src/settings.ts
var defaultSettings = {
  timestampFormat: "YY-MM-DD hh:mm:ss",
  csvDelimiter: ","
};

// src/settings-tab.ts
var import_obsidian = __toModule(require("obsidian"));
var SimpleTimeTrackerSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Super Simple Time Tracker Settings" });
    new import_obsidian.Setting(this.containerEl).setName("Timestamp Display Format").setDesc(createFragment((f) => {
      f.createSpan({ text: "The way that timestamps in time tracker tables should be displayed. Uses " });
      f.createEl("a", { text: "moment.js", href: "https://momentjs.com/docs/#/parsing/string-format/" });
      f.createSpan({ text: " syntax." });
    })).addText((t) => {
      t.setValue(String(this.plugin.settings.timestampFormat));
      t.onChange((v) => __async(this, null, function* () {
        this.plugin.settings.timestampFormat = v.length ? v : defaultSettings.timestampFormat;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian.Setting(this.containerEl).setName("CSV Delimiter").setDesc("The delimiter character that should be used when copying a tracker table as CSV. For example, some languages use a semicolon instead of a comma.").addText((t) => {
      t.setValue(String(this.plugin.settings.csvDelimiter));
      t.onChange((v) => __async(this, null, function* () {
        this.plugin.settings.csvDelimiter = v.length ? v : defaultSettings.csvDelimiter;
        yield this.plugin.saveSettings();
      }));
    });
    this.containerEl.createEl("hr");
    this.containerEl.createEl("p", { text: "If you like this plugin and want to support its development, you can do so through my website by clicking this fancy image!" });
    this.containerEl.createEl("a", { href: "https://ellpeck.de/support" }).createEl("img", { attr: { src: "https://ellpeck.de/res/generalsupport.png" }, cls: "simple-time-tracker-support" });
  }
};

// src/tracker.ts
var import_obsidian2 = __toModule(require("obsidian"));
function startEntry(tracker, name) {
  if (!name)
    name = `Segment ${tracker.entries.length + 1}`;
  let entry = { name, startTime: (0, import_obsidian2.moment)().unix(), endTime: null };
  tracker.entries.push(entry);
}
function endEntry(tracker) {
  let last = tracker.entries.last();
  last.endTime = (0, import_obsidian2.moment)().unix();
}
function isRunning(tracker) {
  let last = tracker.entries.last();
  return last != null && !last.endTime;
}
function saveTracker(tracker, app, section) {
  return __async(this, null, function* () {
    let file = app.workspace.getActiveFile();
    if (!file)
      return;
    let content = yield app.vault.read(file);
    let lines = content.split("\n");
    let prev = lines.filter((_, i) => i <= section.lineStart).join("\n");
    let next = lines.filter((_, i) => i >= section.lineEnd).join("\n");
    content = `${prev}
${JSON.stringify(tracker)}
${next}`;
    yield app.vault.modify(file, content);
  });
}
function loadTracker(json) {
  if (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.log(`Failed to parse Tracker from ${json}`);
    }
  }
  return { entries: [] };
}
function displayTracker(tracker, element, getSectionInfo, settings) {
  let running = isRunning(tracker);
  let btn = new import_obsidian2.ButtonComponent(element).setClass("clickable-icon").setIcon(`lucide-${running ? "stop" : "play"}-circle`).setTooltip(running ? "End" : "Start").onClick(() => __async(this, null, function* () {
    if (running) {
      endEntry(tracker);
    } else {
      startEntry(tracker, name.getValue());
    }
    yield saveTracker(tracker, this.app, getSectionInfo());
  }));
  btn.buttonEl.addClass("simple-time-tracker-btn");
  let name = new import_obsidian2.TextComponent(element).setPlaceholder("Segment name").setDisabled(running);
  name.inputEl.addClass("simple-time-tracker-txt");
  let timer = element.createDiv({ cls: "simple-time-tracker-timers" });
  let currentDiv = timer.createEl("div", { cls: "simple-time-tracker-timer" });
  let current = currentDiv.createEl("span", { cls: "simple-time-tracker-timer-time" });
  currentDiv.createEl("span", { text: "Current" });
  let totalDiv = timer.createEl("div", { cls: "simple-time-tracker-timer" });
  let total = totalDiv.createEl("span", { cls: "simple-time-tracker-timer-time", text: "0s" });
  totalDiv.createEl("span", { text: "Total" });
  if (tracker.entries.length > 0) {
    let table = element.createEl("table", { cls: "simple-time-tracker-table" });
    table.createEl("tr").append(createEl("th", { text: "Segment" }), createEl("th", { text: "Start time" }), createEl("th", { text: "End time" }), createEl("th", { text: "Duration" }), createEl("th"));
    for (let entry of tracker.entries) {
      let row = table.createEl("tr");
      let name2 = row.createEl("td");
      let namePar = name2.createEl("span", { text: entry.name });
      let nameBox = new import_obsidian2.TextComponent(name2).setValue(entry.name);
      nameBox.inputEl.hidden = true;
      row.createEl("td", { text: formatTimestamp(entry.startTime, settings) });
      row.createEl("td", { text: entry.endTime ? formatTimestamp(entry.endTime, settings) : "" });
      row.createEl("td", { text: entry.endTime ? formatDurationBetween(entry.startTime, entry.endTime) : "" });
      let entryButtons = row.createEl("td");
      let editButton = new import_obsidian2.ButtonComponent(entryButtons).setClass("clickable-icon").setTooltip("Edit").setIcon("lucide-pencil").onClick(() => __async(this, null, function* () {
        if (namePar.hidden) {
          namePar.hidden = false;
          nameBox.inputEl.hidden = true;
          editButton.setIcon("lucide-pencil");
          if (nameBox.getValue()) {
            entry.name = nameBox.getValue();
            namePar.setText(entry.name);
            yield saveTracker(tracker, this.app, getSectionInfo());
          }
        } else {
          namePar.hidden = true;
          nameBox.inputEl.hidden = false;
          nameBox.setValue(entry.name);
          editButton.setIcon("lucide-check");
        }
      }));
      new import_obsidian2.ButtonComponent(entryButtons).setClass("clickable-icon").setTooltip("Remove").setIcon("lucide-trash").onClick(() => __async(this, null, function* () {
        tracker.entries.remove(entry);
        yield saveTracker(tracker, this.app, getSectionInfo());
      }));
    }
    let buttons = element.createEl("div", { cls: "simple-time-tracker-bottom" });
    new import_obsidian2.ButtonComponent(buttons).setButtonText("Copy as table").onClick(() => navigator.clipboard.writeText(createMarkdownTable(tracker, settings)));
    new import_obsidian2.ButtonComponent(buttons).setButtonText("Copy as CSV").onClick(() => navigator.clipboard.writeText(createCsv(tracker, settings)));
  }
  setCountdownValues(tracker, current, total, currentDiv);
  let intervalId = window.setInterval(() => {
    if (!element.isConnected) {
      window.clearInterval(intervalId);
      return;
    }
    setCountdownValues(tracker, current, total, currentDiv);
  }, 1e3);
}
function setCountdownValues(tracker, current, total, currentDiv) {
  let currEntry = tracker.entries.last();
  if (currEntry) {
    if (!currEntry.endTime)
      current.setText(formatDurationBetween(currEntry.startTime, (0, import_obsidian2.moment)().unix()));
    total.setText(formatDuration(getTotalDuration(tracker)));
  }
  currentDiv.hidden = !currEntry || !!currEntry.endTime;
}
function getTotalDuration(tracker) {
  let totalDuration = 0;
  for (let entry of tracker.entries) {
    let endTime = entry.endTime ? import_obsidian2.moment.unix(entry.endTime) : (0, import_obsidian2.moment)();
    totalDuration += endTime.diff(import_obsidian2.moment.unix(entry.startTime));
  }
  return totalDuration;
}
function formatTimestamp(timestamp, settings) {
  return import_obsidian2.moment.unix(timestamp).format(settings.timestampFormat);
}
function formatDurationBetween(startTime, endTime) {
  return formatDuration(import_obsidian2.moment.unix(endTime).diff(import_obsidian2.moment.unix(startTime)));
}
function formatDuration(totalTime) {
  let duration = import_obsidian2.moment.duration(totalTime);
  let ret = "";
  if (duration.hours() > 0)
    ret += duration.hours() + "h ";
  if (duration.minutes() > 0)
    ret += duration.minutes() + "m ";
  ret += duration.seconds() + "s";
  return ret;
}
function createMarkdownTable(tracker, settings) {
  let table = [["Segment", "Start time", "End time", "Duration"]];
  for (let entry of tracker.entries)
    table.push(createTableRow(entry, settings));
  table.push(["**Total**", "", "", `**${formatDuration(getTotalDuration(tracker))}**`]);
  let ret = "";
  let widths = Array.from(Array(4).keys()).map((i) => Math.max(...table.map((a) => a[i].length)));
  for (let r = 0; r < table.length; r++) {
    if (r == 1)
      ret += Array.from(Array(4).keys()).map((i) => "-".repeat(widths[i])).join(" | ") + "\n";
    let row = [];
    for (let i = 0; i < 4; i++)
      row.push(table[r][i].padEnd(widths[i], " "));
    ret += row.join(" | ") + "\n";
  }
  return ret;
}
function createCsv(tracker, settings) {
  let ret = "";
  for (let entry of tracker.entries)
    ret += createTableRow(entry, settings).join(settings.csvDelimiter) + "\n";
  return ret;
}
function createTableRow(entry, settings) {
  return [
    entry.name,
    formatTimestamp(entry.startTime, settings),
    entry.endTime ? formatTimestamp(entry.endTime, settings) : "",
    entry.endTime ? formatDurationBetween(entry.startTime, entry.endTime) : ""
  ];
}

// src/main.ts
var SimpleTimeTrackerPlugin = class extends import_obsidian3.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addSettingTab(new SimpleTimeTrackerSettingsTab(this.app, this));
      this.registerMarkdownCodeBlockProcessor("simple-time-tracker", (s, e, i) => {
        let tracker = loadTracker(s);
        e.empty();
        displayTracker(tracker, e, () => i.getSectionInfo(e), this.settings);
      });
      this.addCommand({
        id: `insert`,
        name: `Insert Time Tracker`,
        editorCallback: (e, _) => {
          e.replaceSelection("```simple-time-tracker\n```\n");
        }
      });
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, defaultSettings, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
