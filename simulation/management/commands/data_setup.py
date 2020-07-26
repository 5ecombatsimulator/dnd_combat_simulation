from django.core.management.base import BaseCommand, CommandError
from test_data.dice import gen_dice
from xml_data.convert_source_monsters_xml import parse_file


class Command(BaseCommand):
    help = 'Sets up the dice data and tries to import the Bestiary XML'

    def handle(self, *args, **options):
        gen_dice()
        parse_file("./xml_data/data/Monster Manual Bestiary.xml")
        print("Complete!")
