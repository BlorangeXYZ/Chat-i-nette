#!/bin/bash

# A list of GitHub repositories to download
REPOS=(
  "https://github.com/pasqualerossi/Libft"
  "https://github.com/pasqualerossi/Born2BeRoot-Guide"
  "https://github.com/pasqualerossi/Printf"
  "https://github.com/pasqualerossi/Get_Next_Line"
  "https://github.com/pasqualerossi/MiniTalk"
  "https://github.com/agavrel/42_CheatSheet"
  "https://github.com/pbie42/libft42commented"
  "https://github.com/Glagan/42-libft"
  "https://github.com/hamzaouadia/libft.git"
  "https://github.com/nickdotht/libft/tree/master/libc-funcs"
  "https://github.com/Surfi89/ft_printf"
  "https://github.com/bilalnrts/ft_printf"
  "https://github.com/YaKen1/1337-ft_printf"
  "https://github.com/SolarisCode/ft_printf"
  "https://github.com/statvej/ft_printf"
  "https://github.com/mdabir1203/Get_Next_Line_42"
  "https://github.com/Surfi89/get_next_line"
  "https://github.com/jdecorte-be/42-Get-next-line"
  "https://github.com/520luigi/Get_Next_Line"
  "https://github.com/eperaita/GetNextLine_linked"
  "https://github.com/madebypixel02/so_long"
  "https://github.com/S-LucasSerrano/so_long"
  "https://github.com/dariansereno/so_long"
  "https://github.com/kajun1337/SoLong"
  "https://github.com/Nuno-Jesus/42_so_long"
  "https://github.com/cschm1ed/fract-ol"
  "https://github.com/Asalek/Fractol"
  "https://github.com/BenSouchet/fractol"
  "https://github.com/pbondoer/42-fractol"
  "https://github.com/VBrazhnik/FdF"
  "https://github.com/pbondoer/42-FdF"
  "https://github.com/ailopez-o/42Barcelona-FdF"
  "https://github.com/caroldaniel/42sp-cursus-fdf"
  "https://github.com/jdecorte-be/42-FdF"
  "https://github.com/iciamyplant/Philosophers"
  "https://github.com/Glagan/42-Philosophers"
  "https://github.com/mcombeau/philosophers"
  "https://github.com/mcombeau/minishell"
  "https://github.com/nickdotht/minishell"
  "https://github.com/vportens/minishell"
  "https://github.com/madebypixel02/minishell"
  "https://github.com/cclaude42/minishell"
  "https://github.com/paulahemsi/minishell"
  # Add more repositories as needed
)

# The directory where the repositories will be downloaded
DOWNLOAD_DIR="./pre-git-data"

# Create the download directory if it does not exist
mkdir -p "$DOWNLOAD_DIR"

# Download each repository
for repo in "${REPOS[@]}"; do
  echo "Downloading $repo..."
  git clone --quiet "$repo" "$DOWNLOAD_DIR/$(basename "$repo" .git)"
done

echo "All repositories have been downloaded to $DOWNLOAD_DIR."