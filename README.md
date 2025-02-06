<div align="center">
    <img style="width: 148px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsRvpWXsSxfzEMwDkS5pWxn-mvL3S2PMxv0A&s"/>
    <img style="width: 148px;" src="https://avatars.githubusercontent.com/u/7015300?s=280&v=4"/>
    <br/>
    <h1 style="font-size: 248px;">Horizontal Timeline</h1>
    <a href="https://www.buymeacoffee.com/VishwaGauravIn" target="_blank"><img alt="" src="https://skillicons.dev/icons?i=ts,html,css,react,tailwind" style="vertical-align:center" /></a>
</div>
<br/>

# 👋 Introductions
The Horizontal Timeline is a generic custom control built on the Power Apps component framework (PCF). 
It is built as an alternative to the classic Vertical Timeline by Microsoft, that I've found very confusing to navigate.

Hopefully you'll find it useful.

# ⚙️ Features & Releases
<div style="background-color: #fde68a; border-radius: 4px; padding: 4px 8px; color: black; display: flex; items-align: center;">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
<p style="margin: 0 4px; 0 0">Version 1.0.0 uses the <b>BCP 47 codes</b>, while ≥ 1.1.0 uses <b>LCID Language Codes</b> <a href="https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oe376/6c085406-a698-4e12-9d4d-c3b0ee3dbc4a">See more</a></p>
</div>
<b>Localization - The custom control support following languagecodes at the moment</b><br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/us.png" /> 1033 <b>[default]</b><br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/dk.png" /> 1030<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/fr.png" /> 1036<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/es.png" /> 1034<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/de.png" />
1031<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/cn.png" /> 2052<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/jp.png" /> 1041<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/sa.png" /> 1025<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/br.png" /> 1046<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/it.png" /> 1040<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/in.png" /> 1081<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/nl.png" /> 1043<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/se.png" /> 1053<br/>
<img src="https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/fi.png" /> 1035<br/>

---

<b>Locale Source</b><br/>
<div style="background-color: #bfdbfe; border-radius: 4px; padding: 4px 8px; color: black; display: flex; items-align: center; justify-items: center;">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
<p style="margin: 0 4px; 0 0">Version <b>≥ 1.1.0</b></p>
</div>
The language of the control can be based off of either:

- browser (the browser language)
- systemuser <b>[default]</b> (the personalization setting langauge)
- <s>organisation (the language set by the organisation)</s>
- override (a fixed language on the control)

---

<b>Time units - The custom control supports following time units</b><br/>
The control uses the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat">Intl.DateTimeFormat</a> object to enable language-sensitive date and time formatting. The control allows for the following formats:

Years 
- full <b>[default]</b> (example = "2025")
- short (example = "25")

Quarters 
- prefix <b>[default = empty]</b> (example = "Quarter " -> "Quarter 1")

Months 
- numeric (example = "1")
- 2-digit (example = "01")
- long <b>[default]</b> (example = "January")
- short (example = "Jan")
- narrow (example = "J")

Weeks
- prefix <b>[default = empty]</b> (example = "W" -> "W1")

Days 
- numeric (example = "1")
- 2-digit <b>[default]</b> (example = "01")
- long (example = "Monday")
- short (example = "Mon")
- narrow (example = "M")

Hours
- numeric (example = "1")
- 2-digit <b>[default]</b> (example = "01")

Hour Cycle
- h11 (example = "01PM")
- h12 (example = "01PM")
- h23 <b>[default]</b> (example = "13")
- h24 (example = "13")

---

<b>Timezone Source</b><br/>
<div style="background-color: #bfdbfe; border-radius: 4px; padding: 4px 8px; color: black; display: flex; items-align: center; justify-items: center;">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
<p style="margin: 0 4px; 0 0">Version <b>≥ 1.1.0</b></p>
</div>
The timezone the timeline is shown in can be based off of either:

- browser <b>[default]</b> (based on user's browser timezone)
- override (a fixed timezone set on the control in the IANA Time Zone Database)

---

<b>Custom table support</b><br/>
When configuring the control you can give a json-formatted string that will describe supported tables.
```
{
   "<tablename>": {
     color: "<hex-color>"
   }
}
```
<b>Default</b>
```
{
  "task": {
    "color": "#eab308"
  },
  "appointment": {
    "color": "#7e22ce"
  },
  "milestone": {
    "color": "#e11d48"
  },
  "email": {
    "color": "#16a34a"
  },
  "phonecall": {
    "color": "#fb7185"
  }
}
```

---

<b>Custom milestones</b><br/>
Milestones are dates on your record, that you wish to see on the timeline. You can define a json-formatted string that will describe the dates put into the timeline. Note that if the column schemaname is incorrect, the milestone is not shown - without any errors/warnings.
```
{
  "<column-schemaname>": "<display name>"
}
```
<b>Default</b>
```
{
  "createdon": "Created On",
  "estimatedclosedate": "Estimated Close",
  "actualclose": "Actual Close"
}
```

---

<b>Custom scaling</b><br/>
You can adjust the smallest unit's size (an hour) on the timeline. All other date elements will follow this sizing.
Example: if set to 1 (minimum size) -> a day will become 24px in width -> a week will become 24px*7=188px in width.
<b>default = 4</b>

---

<b>Filter</b></br>
Inside the filter you have the following options:
- Filter by display name (text search)
- Filter by activitytype (chip toggles)
- Filter by date-interval (date picker)
- Filter by owner (lookup)

---

<b>Timeless items</b></br>
You can also see items that do not have any due date (scheduledend) as this is the case. These items will show in a side pane.

---

<b>Background Style & Colors</b><br/>
<div style="background-color: #bfdbfe; border-radius: 4px; padding: 4px 8px; color: black; display: flex; items-align: center; justify-items: center;">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
<p style="margin: 0 4px; 0 0">Version <b>≥ 1.1.0</b></p>
</div>
The background of the timeline items is customizable. There are a few default options and then an override functionality.

- stripes

![alt text](image.png)
- dots

![alt text](image-1.png)

- grid <b>[default]</b>

![alt text](image-2.png)

- topography

![alt text](image-3.png)

- override (bgcolor becomes a free text field where you can insert your css "url()". Example: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='#eab308' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`)

---

<b>Smaller features</b></br>
- Touch support
- Canvas & Custom Page support

# 🏆 Credits:
Lucki2g / Software Ape - Developer

# 📋 Road-map:
