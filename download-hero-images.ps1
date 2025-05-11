# Create the images/hero directory if it doesn't exist
if(!(Test-Path -Path "images/hero" -PathType Container)) {
    New-Item -Path "images/hero" -ItemType Directory -Force
}

# Define the hero images with their URLs
$images = @{
    "hero-digital-transformation.jpg" = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80"
    "hero-pos.jpg" = "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1920&q=80"
    "hero-fleet.jpg" = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
    "hero-crm.jpg" = "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=1920&q=80"
    "hero-towing.jpg" = "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=1920&q=80"
    "hero-gps.jpg" = "https://images.unsplash.com/photo-1576400883215-7083980b6193?w=1920&q=80"
    "hero-ai.jpg" = "https://img.freepik.com/free-photo/ai-solutions-benefits_23-2149168447.jpg"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $outputPath = "images/hero/$($image.Key)"
    Write-Host "Downloading $($image.Key)..."
    Invoke-WebRequest -Uri $image.Value -OutFile $outputPath
}

Write-Host "All images downloaded successfully!" 