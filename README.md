# kwin-mint-tiling
A KWin script that makes window tile the same in KDE Plasma as in the Cinnamon DE

## Usage
This simple script is meant to provide KDE Plasma users with the same keyboard shortcuts and window tiling behavior as in the Cinnamon Desktop Environment.

## Istalling

Download and enter the project directory
```
git clone git@github.com:KonstantinosKaratzidis/kwin-mint-tiling.git
cd kwin-mint-tiling
```

Then run the install script
```
chmod u+x install.sh
./install.sh
```

You may have to manually select the script to being active.
To do that launch System Settings, then go to:  
Window Management > KWin Scripts, and select "Cinnamon Window Tiling"

You also may have to manually remove the following keyboard shortcuts:
Go to System Settings > Shortcuts > KWin and disable:  
- Quick Tile Window to the Bottom  
- Quick Tile Window to the Left  
- Quick Tile Window to the Top  
- Quick Tile Window to the Right  

## How To Use
The keyboard shortcuts enables by the script are:
- Meta+Up    : Tiles to the top
- Meta+Down  : Tiles to the bottom
- Meta+Left  : Tiles to the left
- Meta+Right : Tiles to the right

Windows can also be tiled on cornern e.g. when a window is tile up and you press Meta+Left the window will be tile to the upper left corner.  
  
When a window a tiled up and you press Meta+Up the window will be maximized and vice versa.

## Author
* Konstantinos Karatzidis

## License
* GPL v2
