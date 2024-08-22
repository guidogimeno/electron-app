import subprocess

# Define the input directory containing DICOM files
input_dir = './Tomografias'

# Define the output directory where the NIfTI file will be saved
output_dir = './nIfTI'

# Run the dcm2niix command
subprocess.run(['dcm2niix', '-z', 'y', '-o', output_dir, input_dir])

# -z y: compress the output NIfTI file into .nii.gz
# -o: specify the output directory
